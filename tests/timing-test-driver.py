#!/usr/bin/python3

from testing_module import *


def main(runs, instance_delay):

    # Add header to last results.
    with open("results.txt", "a") as f:
        now = datetime.now()
        f.write(f"\n ===== NEW RUN AT [ { now.strftime("%H:%M:%S") } ] =====\n\n")
        f.close()

    # Remove last log.
    if os.path.exists("log.txt"):
        os.remove("log.txt")

    # Catch failures in the process of gathering targets.
    try:
        # Assemble list of user accounts from file.
        print_and_log(
            "message", 
            f"[ { os.getpid() } @ { ct() } ]",
            f"[ Driver ] Started",
        )
        run_names = []

        with open("accts.txt", "r", encoding="utf-8-sig") as f:
            accounts = f.readlines()
            f.close()

        # Parse accounts into list
        accounts = [
            [x.split(",")[0][1:-1], x.split(",")[1].strip()[1:-1]] for x in accounts
        ]
        print_and_log(
            "message",
            f"[ { os.getpid() } @ { ct() } ]",
            f"[ Driver ] Found { str(len(accounts)) } Accounts",
        )

        # Open webpage and determine the combinations to run
        # Requires a log in first
        print_and_log(
            "message",
            f"[ { os.getpid() } @ { ct() } ]",
            f"[ Driver ] Logging In to Get Launch Candidates",
        )

        try:
            driver = webdriver.Chrome()
            driver.get("https://fett.securehardware.org/")
        except:
            print_and_log(
                "error",
                f"[ { os.getpid() } @ { ct() } ]",
                f"[ Driver ] ERROR: Could not start webdriver.",
            )
            exit()

        log_in(driver, accounts[0][0], accounts[0][1])

        # Logged in OK, let's check the options for launches
        # Click OK to the popup that appears
        print_and_log(
            "message",
            f"[ { os.getpid() } @ { ct() } ]",
            f"[ Driver ] Closing Popup",
        )

        ok_button_xpath = (
            '//*[@id="root"]/div/div/div[2]/div[2]/div/div/div[1]/div[1]/button'
        )

        wait_for_xpath_click(ok_button_xpath)

        # Gather table of launch candidates
        table_xpath = "//*[@id='root']/div/div/div[2]/div[2]/div/div/div/div[2]/div/div/div/div/table/tbody"
        wait_for_xpath(table_xpath)

        rows = table.find_elements(By.TAG_NAME, "tr")

        # For each row in the table, break into items (row @ col)
        for row in rows:
            col = row.find_elements(
                By.TAG_NAME, "td"
            )  # note: index start from 0, 1 is col 2
            tl = []

            # The name will be these fields (the last one is the launch button)
            for c in col[0:4]:
                tl.append(c.text)
            run_names.append(tl)

        print_and_log(
            "message",
            f"[ { os.getpid() } @ { ct() } ]",
            f"[ Driver ] Launch Candidates:",
        )
        [print_and_log("message", "", "\t" + "- " + "-".join(x)) for x in run_names]

    except:

        print_and_log(
            "error",
            f"[ { os.getpid() } @ { ct() } ]",
            f"[ Driver ] ERROR: Failed to gather list of launch candidates.",
        )
        print_and_log(
            "message",
            f"[ { os.getpid() } @ { ct() } ]",
            f"[ Driver ] Closing Driver",
        )
        driver.close()
        exit()

    print_and_log(
        "message",
        f"[ { os.getpid() } @ { ct() } ]",
        f"[ Driver ] Closing Driver",
    )
    driver.close()

    # Launch the processes that will collect data.
    #   Here, I launch runs sets of all n launch candidates,
    #   instance_delay seconds between launches to perform load balancing.
    processes = []
    for x in range(0, runs):
        for run_index in range(0, len(run_names)):
            acct = accounts.pop()

            cmd = [
                "python3",
                "timing-test-child.py",
                str(run_index),
                "-".join(run_names[run_index][1:]),
                acct[0],
                acct[1],
            ]

            print_and_log(
                "command",
                f"[ { os.getpid() } @ { ct() } ]",
                f"[ Driver ] Calling a Child with Command: [{ ' '.join(cmd) }]",
            )

            proc = Popen(cmd, stdin=None, stdout=None, stderr=None, close_fds=True)
            processes.append(proc)
            time.sleep(instance_delay)

    print_and_log(
        "special",
        f"[ { os.getpid() } @ { ct() } ]",
        f"[ Driver ] Waiting for subprocesses to complete",
    )

    exit_codes = [p.wait() for p in processes]

    print_and_log(
        "special",
        f"[ { os.getpid() } @ { ct() } ]",
        f"[ Driver ] Subprocesses finished. Closing driver.",
    )

    exit()


if __name__ == "__main__":

    # Parse Arguments
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "runs",
        type=int,
        nargs="?",
        default=1,
        help="How many times each set of all launch candidates should be run.",
    )
    parser.add_argument(
        "instance_delay",
        type=int,
        nargs="?",
        default=10,
        help="Number of seconds to wait before starting each instance.",
    )
    args = parser.parse_args()
    main(args.runs, args.instance_delay)
