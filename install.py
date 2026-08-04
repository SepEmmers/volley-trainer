import os
import sys
import subprocess
import time

# Reconfigure stdout for UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def find_adb():
    default_sdk_adb = r"C:\Users\seppi\AppData\Local\Android\Sdk\platform-tools\adb.exe"
    if os.path.exists(default_sdk_adb):
        return default_sdk_adb
    
    # Try finding in PATH
    try:
        res = subprocess.run(["adb", "version"], capture_output=True, text=True)
        if res.returncode == 0:
            return "adb"
    except Exception:
        pass
    
    return default_sdk_adb

def run_installer():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    apk_path = os.path.join(script_dir, "VolleyTrainer.apk")
    bat_path = os.path.join(script_dir, "install.bat")

    print("========================================================")
    print("  VOLLEY TRAINER - STREAMLINED USB PHONE INSTALLER")
    print("========================================================")
    print()

    if not os.path.exists(apk_path):
        print(f"[ERROR] APK file not found at: {apk_path}")
        print("Please build VolleyTrainer.apk first.")
        sys.exit(1)

    adb_path = find_adb()
    print(f"Using ADB: {adb_path}")
    print(f"Target APK: {apk_path}")
    print()

    if os.path.exists(bat_path):
        print("Launching batch installation process...\n")
        try:
            result = subprocess.run([bat_path], shell=True)
            sys.exit(result.returncode)
        except Exception as e:
            print(f"Could not launch install.bat directly ({e}). Running via Python ADB driver...")

    # Fallback / Direct Python Execution
    print("[1/3] Checking connected Android USB devices...")
    try:
        devices_out = subprocess.check_output([adb_path, "devices"], text=True)
        print(devices_out.strip())
        lines = [line.strip() for line in devices_out.strip().splitlines() if line.strip() and not line.startswith("List of")]
        
        if not lines:
            print("\n--------------------------------------------------------")
            print("[WARNING] No Android phone detected via USB!")
            print("--------------------------------------------------------")
            print("Please check USB cable and enable 'USB Debugging' in Developer Options.")
            input("\nPress ENTER after connecting your phone to retry...")
    except Exception as err:
        print(f"ADB Error: {err}")

    print("\n[2/3] Installing VolleyTrainer.apk...")
    install_cmd = [adb_path, "install", "-r", "-d", apk_path]
    res = subprocess.run(install_cmd)

    if res.returncode == 0:
        print("\n[3/3] Installation SUCCESSFUL! Launching app on phone...")
        launch_cmd = [adb_path, "shell", "am", "start", "-n", "com.volleytrainer.app/.MainActivity"]
        subprocess.run(launch_cmd)
        print("\n========================================================")
        print(" Volley Trainer is now live on your phone!")
        print("========================================================")
    else:
        print("\nInstallation failed. Ensure USB Debugging is accepted on your phone.")

if __name__ == "__main__":
    run_installer()
