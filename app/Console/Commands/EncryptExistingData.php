<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class EncryptExistingData extends Command
{
    protected $signature = 'data:encrypt-existing {--dry-run : Run without making changes}';
    protected $description = 'Encrypt existing plaintext sensitive data to comply with UU PDP';

    // Fields that need encryption per table (matching Model $casts)
    private array $encryptionMap = [
        'gtks' => [
            'nuptk', 'nik', 'no_kk', 'npwp', 'nomor_rekening_bank',
            'rekening_atas_nama', 'bank', 'telepon', 'email',
            'nama_ibu_kandung', 'nama_suami_istri', 'nip_suami_istri'
        ],
        'students' => [
            'nisn', 'nik', 'nipd', 'alamat', 'no_telp', 'no_hp', 'email',
            'skhun', 'no_kps', 'nama_ayah', 'nik_ayah', 'no_telp_ayah',
            'nama_ibu', 'nik_ibu', 'no_telp_ibu', 'nama_wali', 'nik_wali',
            'no_telp_wali', 'no_peserta_un', 'no_seri_ijazah', 'no_kip',
            'nama_di_kip', 'no_kks', 'no_akta_lahir', 'bank',
            'no_rekening_bank', 'rekening_atas_nama', 'no_kk'
        ],
    ];

    public function handle(): int
    {
        $this->info('========================================');
        $this->info(' DATA ENCRYPTION MIGRATION UTILITY');
        $this->info(' UU No. 27 Tahun 2022 - Perlindungan Data Pribadi');
        $this->info('========================================');
        $this->newLine();

        $isDryRun = $this->option('dry-run');
        if ($isDryRun) {
            $this->warn('🔍 DRY RUN MODE - No changes will be made');
            $this->newLine();
        }

        $totalEncrypted = 0;
        $totalSkipped = 0;
        $totalErrors = 0;

        foreach ($this->encryptionMap as $table => $fields) {
            $this->info("📋 Processing table: {$table}");

            // Check if table exists
            if (!DB::getSchemaBuilder()->hasTable($table)) {
                $this->warn("   ⚠️ Table {$table} does not exist, skipping...");
                continue;
            }

            // Get existing columns
            $existingColumns = DB::getSchemaBuilder()->getColumnListing($table);
            $validFields = array_intersect($fields, $existingColumns);

            if (empty($validFields)) {
                $this->warn("   ⚠️ No matching columns found in {$table}, skipping...");
                continue;
            }

            // Process records
            $records = DB::table($table)->get();
            $tableEncrypted = 0;
            $tableSkipped = 0;
            $tableErrors = 0;

            $bar = $this->output->createProgressBar($records->count());
            $bar->start();

            foreach ($records as $record) {
                $updates = [];
                $recordId = $record->id ?? null;

                foreach ($validFields as $field) {
                    $value = $record->$field ?? null;

                    if ($value === null || $value === '') {
                        continue;
                    }

                    // Check if already encrypted (Laravel encrypted strings start with 'eyJ')
                    if ($this->isAlreadyEncrypted($value)) {
                        $tableSkipped++;
                        continue;
                    }

                    try {
                        $encryptedValue = Crypt::encryptString($value);
                        $updates[$field] = $encryptedValue;
                        $tableEncrypted++;
                    } catch (\Exception $e) {
                        $this->error("\n   ❌ Error encrypting {$field} for ID {$recordId}: " . $e->getMessage());
                        $tableErrors++;
                    }
                }

                // Apply updates
                if (!empty($updates) && !$isDryRun && $recordId !== null) {
                    try {
                        DB::table($table)->where('id', $recordId)->update($updates);
                    } catch (\Exception $e) {
                        $this->error("\n   ❌ Error updating record ID {$recordId}: " . $e->getMessage());
                        $tableErrors++;
                    }
                }

                $bar->advance();
            }

            $bar->finish();
            $this->newLine();

            $this->info("   ✅ Encrypted: {$tableEncrypted} | ⏭️ Skipped: {$tableSkipped} | ❌ Errors: {$tableErrors}");
            $this->newLine();

            $totalEncrypted += $tableEncrypted;
            $totalSkipped += $tableSkipped;
            $totalErrors += $tableErrors;
        }

        $this->newLine();
        $this->info('========================================');
        $this->info(' SUMMARY');
        $this->info('========================================');
        $this->info("✅ Total Fields Encrypted: {$totalEncrypted}");
        $this->info("⏭️ Total Fields Skipped (already encrypted): {$totalSkipped}");
        $this->info("❌ Total Errors: {$totalErrors}");

        if ($isDryRun) {
            $this->newLine();
            $this->warn('🔍 This was a DRY RUN. Run without --dry-run to apply changes.');
        } else {
            $this->newLine();
            $this->info('🔒 Data encryption completed successfully!');
            $this->info('📌 Important: Make sure APP_KEY is backed up securely!');
        }

        return $totalErrors > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    /**
     * Check if a value is already encrypted by Laravel
     */
    private function isAlreadyEncrypted(string $value): bool
    {
        // Laravel encrypted values are base64-encoded JSON starting with 'eyJ'
        if (!str_starts_with($value, 'eyJ')) {
            return false;
        }

        try {
            // Try to decode base64 and check if it's valid JSON with expected keys
            $decoded = base64_decode($value, true);
            if ($decoded === false) {
                return false;
            }

            $json = json_decode($decoded, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return false;
            }

            // Laravel encryption payload has these keys
            return isset($json['iv']) && isset($json['value']) && isset($json['mac']);
        } catch (\Exception $e) {
            return false;
        }
    }
}
