<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AutoBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:auto-backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Melakukan backup database dan storage secara otomatis dengan rotasi 7 hari';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Auto Backup Process...');
        
        $backupDir = storage_path('app/backups/auto');
        if (!file_exists($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        $timestamp = date('Y-m-d_H-i-s');
        
        // 1. Database Backup
        $this->backupDatabase($backupDir, $timestamp);
        
        // 2. Storage Backup
        $this->backupStorage($backupDir, $timestamp);
        
        // 3. Pruning (Hapus backup > 7 hari)
        $this->pruneOldBackups($backupDir);
        
        $this->info('Auto Backup Completed Successfully!');
    }

    protected function backupDatabase($dir, $timestamp)
    {
        $this->comment('Backing up Database...');
        $filename = "db-backup-{$timestamp}.sql";
        $path = $dir . DIRECTORY_SEPARATOR . $filename;
        
        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');
        
        $dumpPath = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
        if (!file_exists($dumpPath)) $dumpPath = 'mysqldump';

        $command = sprintf(
            '"%s" --user="%s" --password="%s" "%s" > "%s"',
            $dumpPath, $dbUser, $dbPass, $dbName, $path
        );

        exec($command, $output, $returnVar);

        if ($returnVar === 0) {
            $this->info("Database backup saved: {$filename}");
        } else {
            $this->error("Database backup failed with exit code: {$returnVar}");
        }
    }

    protected function backupStorage($dir, $timestamp)
    {
        $this->comment('Backing up Storage (Public)...');
        $filename = "storage-backup-{$timestamp}.zip";
        $path = $dir . DIRECTORY_SEPARATOR . $filename;
        
        $zip = new \ZipArchive();
        if ($zip->open($path, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === TRUE) {
            $source = storage_path('app/public');
            if (is_dir($source)) {
                $files = new \RecursiveIteratorIterator(
                    new \RecursiveDirectoryIterator($source),
                    \RecursiveIteratorIterator::LEAVES_ONLY
                );

                foreach ($files as $file) {
                    if (!$file->isDir()) {
                        $filePath = $file->getRealPath();
                        $relativePath = substr($filePath, strlen($source) + 1);
                        $zip->addFile($filePath, $relativePath);
                    }
                }
            }
            $zip->close();
            $this->info("Storage backup saved: {$filename}");
        } else {
            $this->error("Failed to create storage backup zip.");
        }
    }

    protected function pruneOldBackups($dir)
    {
        $this->comment('Pruning old backups (older than 7 days)...');
        $files = glob($dir . '/*');
        $now = time();
        $daysToKeep = 7;

        foreach ($files as $file) {
            if (is_file($file)) {
                if ($now - filemtime($file) >= $daysToKeep * 24 * 60 * 60) {
                    unlink($file);
                    $this->warn("Deleted old backup: " . basename($file));
                }
            }
        }
    }
}
