using System;
using System.Diagnostics;
using System.Drawing;
using System.Windows.Forms;
using System.Threading;
using System.IO;

public class SidaduzControlPanel : Form
{
    private Label lblTitle, lblSubtitle, lblFooter;
    private Label lblDbStatus, lblAppStatus, lblApacheStatus, lblWaStatus;
    private Button btnStartDb, btnStopDb;
    private Button btnStartApp, btnStopApp;
    private Button btnStartApache, btnStopApache;
    private Button btnStartWa, btnStopWa;
    private Button btnOpenBrowser, btnExit;
    private Panel panelDb, panelApp, panelApache, panelWa;
    
    private bool mysqlRunning = false;
    private bool phpRunning = false;
    private bool apacheRunning = false;
    private bool waRunning = false;
    
    private Process phpProcess = null;
    private Process waProcess = null;
    
    // Base path - dynamically determined from exe location
    private string basePath;
    private string sidaduzPath;
    private string waPath;
    
    public SidaduzControlPanel()
    {
        // Get the directory where the exe is located
        basePath = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
        sidaduzPath = Path.Combine(basePath, "sidaduz");
        
        // Fallback if sidaduz folder doesn't exist in same directory
        if (!Directory.Exists(sidaduzPath))
        {
            sidaduzPath = @"C:\xampp\htdocs\sidaduz";
        }

        waPath = Path.Combine(sidaduzPath, "wa-gateway");
        
        InitializeComponents();
        CheckServices();
    }
    
    private void InitializeComponents()
    {
        this.Text = "SIDADUZ Control Panel v1.1";
        this.Size = new Size(420, 610);
        this.StartPosition = FormStartPosition.CenterScreen;
        this.FormBorderStyle = FormBorderStyle.FixedSingle;
        this.MaximizeBox = false;
        this.BackColor = Color.FromArgb(250, 250, 252);
        
        // Title
        lblTitle = new Label();
        lblTitle.Text = "SIDADUZ";
        lblTitle.Font = new Font("Segoe UI", 24, FontStyle.Bold);
        lblTitle.ForeColor = Color.FromArgb(79, 70, 229);
        lblTitle.Location = new Point(20, 15);
        lblTitle.AutoSize = true;
        this.Controls.Add(lblTitle);
        
        lblSubtitle = new Label();
        lblSubtitle.Text = "Control Panel - Sistem Informasi Data Terpadu";
        lblSubtitle.Font = new Font("Segoe UI", 9);
        lblSubtitle.ForeColor = Color.Gray;
        lblSubtitle.Location = new Point(22, 55);
        lblSubtitle.AutoSize = true;
        this.Controls.Add(lblSubtitle);
        
        // Panel MySQL
        panelDb = CreateServicePanel("MySQL Database", 90, out lblDbStatus, out btnStartDb, out btnStopDb);
        btnStartDb.Click += (s, e) => StartMySQL();
        btnStopDb.Click += (s, e) => StopMySQL();
        
        // Panel PHP Server
        panelApp = CreateServicePanel("PHP Dev Server (8000)", 170, out lblAppStatus, out btnStartApp, out btnStopApp);
        btnStartApp.Click += (s, e) => StartPHP();
        btnStopApp.Click += (s, e) => StopPHP();
        
        // Panel Apache
        panelApache = CreateServicePanel("Apache Web Server", 250, out lblApacheStatus, out btnStartApache, out btnStopApache);
        btnStartApache.Click += (s, e) => StartApache();
        btnStopApache.Click += (s, e) => StopApache();

        // Panel WhatsApp Gateway
        panelWa = CreateServicePanel("WhatsApp Gateway (3000)", 330, out lblWaStatus, out btnStartWa, out btnStopWa);
        btnStartWa.Click += (s, e) => StartWA();
        btnStopWa.Click += (s, e) => StopWA();
        
        // Open Browser Button
        btnOpenBrowser = new Button();
        btnOpenBrowser.Text = "🌐 Buka Aplikasi di Browser";
        btnOpenBrowser.Font = new Font("Segoe UI", 11, FontStyle.Bold);
        btnOpenBrowser.Size = new Size(370, 45);
        btnOpenBrowser.Location = new Point(20, 420);
        btnOpenBrowser.BackColor = Color.FromArgb(79, 70, 229);
        btnOpenBrowser.ForeColor = Color.White;
        btnOpenBrowser.FlatStyle = FlatStyle.Flat;
        btnOpenBrowser.FlatAppearance.BorderSize = 0;
        btnOpenBrowser.Cursor = Cursors.Hand;
        btnOpenBrowser.Click += (s, e) => OpenBrowser();
        this.Controls.Add(btnOpenBrowser);
        
        // Exit Button
        btnExit = new Button();
        btnExit.Text = "Keluar";
        btnExit.Font = new Font("Segoe UI", 10);
        btnExit.Size = new Size(370, 35);
        btnExit.Location = new Point(20, 475);
        btnExit.BackColor = Color.FromArgb(220, 220, 225);
        btnExit.ForeColor = Color.FromArgb(60, 60, 60);
        btnExit.FlatStyle = FlatStyle.Flat;
        btnExit.FlatAppearance.BorderSize = 0;
        btnExit.Cursor = Cursors.Hand;
        btnExit.Click += (s, e) => this.Close();
        this.Controls.Add(btnExit);
        
        // Footer Label
        lblFooter = new Label();
        lblFooter.Text = "Made By Fanzhy ❤️ Build with Love For Support One Data Education";
        lblFooter.Font = new Font("Segoe UI", 8, FontStyle.Italic);
        lblFooter.ForeColor = Color.FromArgb(120, 120, 130);
        lblFooter.TextAlign = ContentAlignment.MiddleCenter;
        lblFooter.Size = new Size(370, 30);
        lblFooter.Location = new Point(20, 525);
        this.Controls.Add(lblFooter);
    }
    
    private Panel CreateServicePanel(string title, int top, out Label statusLabel, out Button startBtn, out Button stopBtn)
    {
        Panel panel = new Panel();
        panel.Size = new Size(370, 65);
        panel.Location = new Point(20, top);
        panel.BackColor = Color.White;
        panel.BorderStyle = BorderStyle.None;
        panel.Paint += (s, e) => {
            ControlPaint.DrawBorder(e.Graphics, panel.ClientRectangle, 
                Color.FromArgb(230, 230, 235), 1, ButtonBorderStyle.Solid,
                Color.FromArgb(230, 230, 235), 1, ButtonBorderStyle.Solid,
                Color.FromArgb(230, 230, 235), 1, ButtonBorderStyle.Solid,
                Color.FromArgb(230, 230, 235), 1, ButtonBorderStyle.Solid);
        };
        
        Label lblTitle = new Label();
        lblTitle.Text = title;
        lblTitle.Font = new Font("Segoe UI", 10, FontStyle.Bold);
        lblTitle.ForeColor = Color.FromArgb(50, 50, 50);
        lblTitle.Location = new Point(15, 10);
        lblTitle.AutoSize = true;
        panel.Controls.Add(lblTitle);
        
        statusLabel = new Label();
        statusLabel.Text = "● Stopped";
        statusLabel.Font = new Font("Segoe UI", 9);
        statusLabel.ForeColor = Color.Gray;
        statusLabel.Location = new Point(15, 35);
        statusLabel.AutoSize = true;
        panel.Controls.Add(statusLabel);
        
        startBtn = new Button();
        startBtn.Text = "Start";
        startBtn.Font = new Font("Segoe UI", 9, FontStyle.Bold);
        startBtn.Size = new Size(70, 30);
        startBtn.Location = new Point(210, 18);
        startBtn.BackColor = Color.FromArgb(34, 197, 94);
        startBtn.ForeColor = Color.White;
        startBtn.FlatStyle = FlatStyle.Flat;
        startBtn.FlatAppearance.BorderSize = 0;
        startBtn.Cursor = Cursors.Hand;
        panel.Controls.Add(startBtn);
        
        stopBtn = new Button();
        stopBtn.Text = "Stop";
        stopBtn.Font = new Font("Segoe UI", 9, FontStyle.Bold);
        stopBtn.Size = new Size(70, 30);
        stopBtn.Location = new Point(290, 18);
        stopBtn.BackColor = Color.FromArgb(239, 68, 68);
        stopBtn.ForeColor = Color.White;
        stopBtn.FlatStyle = FlatStyle.Flat;
        stopBtn.FlatAppearance.BorderSize = 0;
        stopBtn.Cursor = Cursors.Hand;
        panel.Controls.Add(stopBtn);
        
        this.Controls.Add(panel);
        return panel;
    }
    
    private void SetStatus(Label lbl, Panel panel, bool running)
    {
        if (running)
        {
            lbl.Text = "● Running";
            lbl.ForeColor = Color.FromArgb(34, 197, 94);
            panel.BackColor = Color.FromArgb(240, 253, 244);
        }
        else
        {
            lbl.Text = "● Stopped";
            lbl.ForeColor = Color.Gray;
            panel.BackColor = Color.White;
        }
    }
    
    private void CheckServices()
    {
        // Check MySQL
        Process[] mysqld = Process.GetProcessesByName("mysqld");
        mysqlRunning = mysqld.Length > 0;
        SetStatus(lblDbStatus, panelDb, mysqlRunning);
        
        // Check PHP
        Process[] php = Process.GetProcessesByName("php");
        phpRunning = php.Length > 0;
        SetStatus(lblAppStatus, panelApp, phpRunning);
        
        // Check Apache
        Process[] httpd = Process.GetProcessesByName("httpd");
        apacheRunning = httpd.Length > 0;
        SetStatus(lblApacheStatus, panelApache, apacheRunning);

        // Check WhatsApp (Node)
        Process[] node = Process.GetProcessesByName("node");
        waRunning = node.Length > 0;
        SetStatus(lblWaStatus, panelWa, waRunning);
    }
    
    private void StartMySQL()
    {
        try
        {
            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = @"C:\xampp\mysql\bin\mysqld.exe";
            psi.Arguments = @"--defaults-file=""C:\xampp\mysql\bin\my.ini"" --standalone";
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            Process.Start(psi);
            Thread.Sleep(1500);
            CheckServices();
        }
        catch (Exception ex)
        {
            MessageBox.Show("Error starting MySQL: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
    
    private void StopMySQL()
    {
        try
        {
            foreach (Process p in Process.GetProcessesByName("mysqld"))
            {
                p.Kill();
            }
            Thread.Sleep(500);
            CheckServices();
        }
        catch { }
    }
    
    private void StartPHP()
    {
        try
        {
            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = "php";
            psi.Arguments = "artisan serve";
            psi.WorkingDirectory = sidaduzPath;
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            phpProcess = Process.Start(psi);
            Thread.Sleep(1500);
            CheckServices();
        }
        catch (Exception ex)
        {
            MessageBox.Show("Error starting PHP: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
    
    private void StopPHP()
    {
        try
        {
            foreach (Process p in Process.GetProcessesByName("php"))
            {
                p.Kill();
            }
            Thread.Sleep(500);
            CheckServices();
        }
        catch { }
    }
    
    private void StartApache()
    {
        try
        {
            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = @"C:\xampp\apache\bin\httpd.exe";
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            Process.Start(psi);
            Thread.Sleep(1500);
            CheckServices();
        }
        catch (Exception ex)
        {
            MessageBox.Show("Error starting Apache: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
    
    private void StopApache()
    {
        try
        {
            foreach (Process p in Process.GetProcessesByName("httpd"))
            {
                p.Kill();
            }
            Thread.Sleep(500);
            CheckServices();
        }
        catch { }
    }

    private void StartWA()
    {
        try
        {
            if (!Directory.Exists(waPath))
            {
                MessageBox.Show("Folder WhatsApp Gateway tidak ditemukan di: " + waPath, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = "node";
            psi.Arguments = "server.js";
            psi.WorkingDirectory = waPath;
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            waProcess = Process.Start(psi);
            Thread.Sleep(2000);
            CheckServices();
        }
        catch (Exception ex)
        {
            MessageBox.Show("Error starting WhatsApp Gateway: " + ex.Message + "\nPastikan Node.js sudah terinstall.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private void StopWA()
    {
        try
        {
            foreach (Process p in Process.GetProcessesByName("node"))
            {
                p.Kill();
            }
            Thread.Sleep(500);
            CheckServices();
        }
        catch { }
    }
    
    private void OpenBrowser()
    {
        string url = phpRunning ? "http://127.0.0.1:8000" : "http://localhost/sidaduz/";
        try
        {
            Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
        }
        catch { }
    }
    
    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        base.OnFormClosing(e);
    }
    
    [STAThread]
    public static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new SidaduzControlPanel());
    }
}
