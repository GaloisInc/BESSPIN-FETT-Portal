#!/usr/bin/python3

from testing_module import *


def main(index, name, un, pw):

    # Start Webdriver
    try:
        print_and_log(
            "message", f"[ { os.getpid() } @ { ct() } ]", f"Starting WebDriver",
        )
        options = webdriver.ChromeOptions()
        options.add_argument("--start-maximized")
        driver = webdriver.Chrome(options=options)
        driver.set_window_size(600, 600)
        driver.maximize_window()
        driver.get("https://fett.securehardware.org/")
    except:
        print_and_log(
            "error",
            f"[ { os.getpid() } @ { ct() } ]",
            f"ERROR: Child failed to open Webdriver, likely because too many are open",
        )
        write_results(name, "FAILED: could not open WebDriver")
        driver.close()
        exit()

    # Logging In
    try:
        print_and_log(
            "message",
            f"[ { os.getpid() } @ { ct() } ]",
            f"Started WebDriver, Logging In",
        )

        login(driver, un, pw)

    except:
        print_and_log(
            "error",
            f"[ { os.getpid() } @ { ct() } ]",
            f"ERROR: Child failed to log in, likely because of bad credentials: { un }, { pw }",
        )
        write_results(name, "FAILED: logging in failed")
        driver.close()
        exit()

    # Get table
    try:
        print_and_log(
            "message", f"[ { os.getpid() } @ { ct() } ]", f"Logged In, Getting Table",
        )

        # Wait for presence and click OK button
        ok_button_xpath = (
            '//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button'
        )

        wait_for_xpath_click(ok_button_xpath)

        # Click launch
        print_and_log(
            "message", f"[ { os.getpid() } @ { ct() } ]", f"Launching Instance",
        )

        launch_button_xpath = f"//*[@id='root']/div/div/div[2]/div[2]/div/div/div/div[2]/div/div/div/div/table/tbody/tr[{ index + 1}]/td[5]/button"
        wait_for_xpath_click(launch_button_xpath)

        # click OK on the time notice dialog
        ok_button_xpath = "/html/body/div[2]/div[3]/div[3]/button"
        wait_for_xpath_click(ok_button_xpath)

    except:
        print_and_log(
            "error",
            f"[ { os.getpid() } @ { ct() } ]",
            f"ERROR: Portal could not load table of launch candidates for user: { un } - consider deleting them from accts.txt",
        )
        write_results(name, f"FAILED: portal hung on user { un }")
        driver.close()
        exit()

    # Wait for Provisioning to Start
    print_and_log(
        "message", f"[ { os.getpid() } @ { ct() } ]", f"Instance Launched, Queueing",
    )
    status_xpath = "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[5]"

    expect_wait_status(status_xpath, "provisioning", "queueing")

    # Provisioning Started
    t0 = time.time()
    print_and_log(
        "message",
        f"[ { os.getpid() } @ { ct() } ]",
        f"First Time Captured at { ct() }, Instance Began Provisioning",
    )

    expect_wait_status(status_xpath, "running", "provisioning")

    # Running
    t1 = time.time()
    print_and_log(
        "message",
        f"[ { os.getpid() } @ { ct() } ]",
        f"Second Time Captured at { ct() }, Instance Started",
    )

    # Try to terminate instance
    try:

        print_and_log(
            "message",
            f"[ { os.getpid() } @ { ct() } ]",
            f"Terminating Instance, Writing to File",
        )

        # Settings button
        settings_button_xpath = "//*[@id='root']/div/div/div[2]/div[2]/div/div/div[1]/div[2]/div/div/div/div/table/tbody/tr/td[6]/button"
        wait_for_xpath_click(settings_button_xpath)

        # Terminate button
        terminate_button_xpath = "/html/body/div[3]/div[3]/div[7]/button"
        wait_for_xpath_click(terminate_button_xpath)

        # Possibly fix issue where clicking terminate does not affect instance
        time.sleep(10)

    except:

        print_and_log(
            "error",
            f"[ { os.getpid() } @ { ct() } ]",
            f"ERROR: Failed to terminate; Writing to file",
        )

    # Write Results Out
    write_results(name, str(t1 - t0))

    print_and_log(
        "message", f"[ { os.getpid() } @ { ct() } ]", f"Ending Process.",
    )
    driver.close()
    exit()


if __name__ == "__main__":

    print_and_log(
        "command",
        f"[ { os.getpid() } @ { ct() } ]",
        f"Child Started with Arguments: { str(sys.argv[1:5]) }",
    )

    # Parse Arguments
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "index",
        type=int,
        help="Index in list of launch candidates to run in this child.",
    )

    parser.add_argument("name", type=str, help="Name of this run's launch profile.")

    parser.add_argument(
        "username", type=str, help="Username of the account to log in to Portal with."
    )

    parser.add_argument(
        "password", type=str, help="Password of the account to log in to Portal with."
    )

    args = parser.parse_args()

    main(args.index, args.name, args.username, args.password)
