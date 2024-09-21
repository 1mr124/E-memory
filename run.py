#!/home/mr124/PyEnv/E-Memory/bin/python3

from FlaskSite import createApp
import subprocess
import sys


def get_run_configuration():
    """Determine the run configuration based on command-line arguments."""
    return len(sys.argv) == 2


def generate_requirements():
    with open('requirements.txt', 'w') as f:
        subprocess.check_call([sys.executable, '-m', 'pip', 'freeze'], stdout=f)
    print("requirements.txt generated successfully.")


def install_requirements():
    try:
        generate_requirements()
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("All packages installed successfully.")
    except Exception as e:
        print(f"Failed to install packages due to excpetion: {e}")


def main():
    """Main entry point for the script."""
    # Call the function to install requirements
    install_requirements()
    app = createApp()
    run_config = get_run_configuration()
    
    if run_config:
        # Run the app globally on LAN
        app.run(host="0.0.0.0", port=5000, debug=False)
    else:
        # Run the app on localhost with debug mode off
        print("Local")
        app.run(debug=True,port=5001)


if __name__ == '__main__':
    main()
    # Trying Temp Test (Where is my mind)
