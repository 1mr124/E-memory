#!/home/mr124/PyEnv/E-Memory/bin/python3

from FlaskSite import createApp
import subprocess
import sys


def get_run_configuration():
    """Determine the run configuration based on command-line arguments."""
    return len(sys.argv) == 2


def generate_requirements():
    """
    this check if file exists and return if it is, but if adding new lip it won't update so generate it every time is better
    if os.path.exists('requirements.txt'):
        print("requirements.txt already exist.")
        return
    """
    try:
        with open('requirements.txt', 'w') as f:
            subprocess.check_call([sys.executable, '-m', 'pip', 'freeze'], stdout=f)
        print("requirements.txt generated successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to generate requirements.txt: {e}")


def install_requirements():
    try:
        generate_requirements()
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("All packages installed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to install packages: {e}")


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
