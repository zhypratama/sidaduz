using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Security.Principal;

class SidaduzInstaller
{
    private static string basePath;
    private static string sidaduzPath;
    private static string phpPath = @"C:\xampp\php\php.exe";
    private static string composerPharUrl = "https://getcomposer.org/composer.phar";
    private static string repoZipUrl = "https://github.com/zhypratama/sidaduz/archive/refs/heads/main.zip";
    
    static void Main(string[] args)
    {
        Console.Title = "SIDADUZ One-Click Installer";
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine(@"
   _____ _____ _____          _____  _    _ ______ 
  / ____|_   _|  __ \   /\   |  __ \| |  | |___  /
 | (___   | | | |  | | /  \  | |  | | |  | |  / / 
  \___ \  | | | |  | |/ /\ \ | |  | | |  | | / /  
  ____) |_| |_| |__| / ____ \| |__| | |__| |/ /__ 
 |_____/|_____|_____/_/    \_\_____/ \____//_____|
                                                  
        One-Click Downloader & Installer
        (Internet Connection Required)
        ");
        Console.ResetColor();

        if (!IsAdministrator())
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("[!] Error: Mohon 'Run as Administrator'.");
            Console.ReadKey();
            return;
        }

        basePath = Directory.GetCurrentDirectory();
        
        // Smart Path Detection (Checking if we are already inside, or need to download)
        if (File.Exists(Path.Combine(basePath, "artisan")))
        {
            sidaduzPath = basePath;
            Console.WriteLine("[INFO] Installer berjalan di dalam folder aplikasi.");
        }
        else
        {
            sidaduzPath = Path.Combine(basePath, "sidaduz");
        }

        // 1. Check Prerequisites
        Console.WriteLine("\n[1/5] Memeriksa Prasyarat Sistem...");
        if (!File.Exists(phpPath))
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("[!] PHP tidak ditemukan di " + phpPath);
            Console.WriteLine("    Pastikan XAMPP terinstall.");
            Console.ResetColor();
            Console.Write("    Lanjutkan manual? (y/n): ");
            if (Console.ReadLine().ToLower() != "y") return;
        }
        else
        {
            Console.WriteLine("    [OK] PHP terdeteksi.");
        }

        // 2. Download & Extract (If App Not Found)
        if (!File.Exists(Path.Combine(sidaduzPath, "artisan")))
        {
            Console.WriteLine("\n[2/5] Mengunduh Aplikasi dari GitHub...");
            Console.WriteLine("    Download URL: " + repoZipUrl);
            
            string zipPath = Path.Combine(basePath, "sidaduz_source.zip");
            
            try
            {
                using (WebClient client = new WebClient())
                {
                    client.Headers.Add("User-Agent", "SidaduzInstaller");
                    Console.Write("    Downloading... ");
                    client.DownloadFile(repoZipUrl, zipPath);
                    Console.WriteLine("[OK]");
                }

                Console.WriteLine("    Mengekstrak file (Extracting)...");
                // Use PowerShell for Zip Extraction (Native Windows Feature)
                // Extract into current dir -> creates sidaduz-main folder
                string psCommand = "Expand-Archive -Path '" + zipPath + "' -DestinationPath '" + basePath + "' -Force";
                RunCommand("powershell", "-NoProfile -Command \"" + psCommand + "\"", basePath);
                
                string extractedFolder = Path.Combine(basePath, "sidaduz-main");
                if (Directory.Exists(extractedFolder))
                {
                    if (Directory.Exists(sidaduzPath)) Directory.Delete(sidaduzPath, true);
                    Directory.Move(extractedFolder, sidaduzPath);
                    Console.WriteLine("    [OK] Aplikasi berhasil diunduh ke folder 'sidaduz'.");
                    
                    // Cleanup Zip
                    File.Delete(zipPath);
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("[!] Gagal mengekstrak. Folder 'sidaduz-main' tidak ditemukan.");
                    Console.ReadKey();
                    return;
                }
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[!] Gagal download: " + ex.Message);
                Console.ReadKey();
                return;
            }
        }
        else
        {
            Console.WriteLine("\n[2/5] Aplikasi sudah tersedia. Melewati download.");
        }

        // 3. Environment Setup
        Console.WriteLine("\n[3/5] Konfigurasi Environment (.env)...");
        string envExample = Path.Combine(sidaduzPath, ".env.example");
        string envFile = Path.Combine(sidaduzPath, ".env");

        if (!File.Exists(envFile) && File.Exists(envExample))
        {
            File.Copy(envExample, envFile);
            Console.WriteLine("    [OK] File .env berhasil dibuat.");
            RunCommand(phpPath, "artisan key:generate", sidaduzPath);
        }
        else
        {
            Console.WriteLine("    [SKIP] File .env sudah ada.");
        }

        // 4. Install Dependencies
        Console.WriteLine("\n[4/5] Install Dependencies & Database...");
        
        // Check for Composer
        string composerCmd = "composer";
        bool localComposer = false;
        
        if (!IsCommandAvailable("composer"))
        {
            // Download composer.phar locally
            string pharPath = Path.Combine(sidaduzPath, "composer.phar");
            if (!File.Exists(pharPath))
            {
                Console.WriteLine("    [INFO] Composer tidak ditemukan. Mendownload composer.phar...");
                try
                {
                    using (WebClient client = new WebClient())
                    {
                        client.DownloadFile(composerPharUrl, pharPath);
                    }
                } 
                catch 
                {
                    Console.WriteLine("    [WARN] Gagal download composer.phar. Pastikan internet stabil.");
                }
            }
            
            if (File.Exists(pharPath))
            {
                composerCmd = "\"" + phpPath + "\" composer.phar";
                localComposer = true;
                Console.WriteLine("    [OK] Menggunakan local composer.phar.");
            }
        }
        else
        {
            Console.WriteLine("    [OK] Menggunakan Global Composer.");
        }

        Console.Write("    Install Dependencies & Migrate DB (y/n)? [Default: y]: ");
        string confirm = Console.ReadLine();
        if (confirm.ToLower() != "n")
        {
            string installArgs = "install --no-interaction --prefer-dist --optimize-autoloader";
            if (localComposer)
            {
                // Run php composer.phar install
                 RunCommand(phpPath, "composer.phar " + installArgs, sidaduzPath);
            }
            else
            {
                // Run composer install (Standard shell)
                RunCommand("cmd", "/c composer " + installArgs, sidaduzPath);
            }

            // Migrate
            Console.WriteLine("    Migrasi Database...");
            RunCommand(phpPath, "artisan migrate:fresh --seed --force", sidaduzPath);
        }
        
        // 5. Security Fix
        Console.WriteLine("\n[5/5] Finalisasi Security (Whitelist IP)...");
        string whitelistCommand = "tinker --execute=\"\\App\\Models\\IpWhitelist::firstOrCreate(['ip_address' => '127.0.0.1'], ['description' => 'Localhost']); \\App\\Models\\IpWhitelist::firstOrCreate(['ip_address' => '::1'], ['description' => 'Localhost IPv6']); echo 'Whitelist Applied';\"";
        RunCommand(phpPath, "artisan " + whitelistCommand, sidaduzPath);
        RunCommand(phpPath, "artisan storage:link", sidaduzPath);

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("\n========================================================");
        Console.WriteLine("   INSTALASI SUKSES! 🚀");
        Console.WriteLine("========================================================");
        Console.ResetColor();
        Console.WriteLine("Anda bisa menutup jendela ini.");
        Console.WriteLine("Tekan sembarang tombol...");
        Console.ReadKey();
    }
    
    // Helper Methods
    static void RunCommand(string fileName, string arguments, string workingDir)
    {
        try
        {
            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = fileName;
            psi.Arguments = arguments;
            psi.WorkingDirectory = workingDir;
            psi.UseShellExecute = false;
            psi.RedirectStandardOutput = true;
            psi.RedirectStandardError = true;
            psi.CreateNoWindow = true;

            using (Process process = Process.Start(psi))
            {
                string output = process.StandardOutput.ReadToEnd();
                // string err = process.StandardError.ReadToEnd(); // Optional logging
                process.WaitForExit();
                if (!string.IsNullOrWhiteSpace(output)) Console.WriteLine(output);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("[CMD ERROR] " + ex.Message);
        }
    }

    static bool IsCommandAvailable(string command)
    {
        try
        {
            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = "where";
            psi.Arguments = command;
            psi.UseShellExecute = false;
            psi.RedirectStandardOutput = true;
            psi.RedirectStandardError = true;
            psi.CreateNoWindow = true;

            using (Process process = Process.Start(psi))
            {
                process.WaitForExit();
                return process.ExitCode == 0;
            }
        }
        catch { return false; }
    }

    static bool IsAdministrator()
    {
        WindowsIdentity identity = WindowsIdentity.GetCurrent();
        WindowsPrincipal principal = new WindowsPrincipal(identity);
        return principal.IsInRole(WindowsBuiltInRole.Administrator);
    }
}
