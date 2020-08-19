# Selenium
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

# Other
import time
import os
import sys
from subprocess import Popen
from datetime import datetime
from termcolor import colored
import argparse

# Return Current Time
def ct():
    now = datetime.now()
    return now.strftime("%H:%M:%S")


def format_exc(exc):
    """ format the exception for printing """
    try:
        return f"<{exc.__class__.__name__}>: {exc}"
    except:
        return "<Non-recognized Exception>"


def print_and_log(type, header, text, exc=None):
    # log
    log(f"{ header } { text }")

    # print in color
    if type == "error":
        print(f"{ colored(header, 'red') } { text }\n{ format_exc(exc) }")
    if type == "message":
        print(f"{ colored(header, 'green') } { text }")
    if type == "command":
        print(f"{ colored(header, 'cyan') } { text }")
    if type == "warning":
        print(f"{ colored(header, 'yellow') } { text }")
    if type == "special":
        print(f"{ colored(header, 'magenta') } { text }")


def log(text):
    with open("log.txt", "a") as f:
        f.write(text)
        f.write("\n")
        f.close()


def write_results(name, string):
    with open("results.txt", "a") as f:
        now = datetime.now()
        f.write(f"[ { now.strftime('%H:%M:%S') } ] : { name } : { string }\n")
        f.close()


# Webdriver Module Functions


def login(driver, un, pw):
    username = driver.find_element_by_id("username")
    username.clear()
    username.send_keys(un)

    password = driver.find_element_by_id("password")
    password.clear()
    password.send_keys(pw)

    driver.find_element_by_css_selector("button").click()


def wait_for_xpath(driver, xpath, wait=100):
    return WebDriverWait(driver, wait).until(
        EC.presence_of_element_located((By.XPATH, xpath))
    )


def wait_for_xpath_click(driver, xpath, wait=100):
    item = wait_for_xpath(driver, xpath, wait)
    item.click()


def wait_for_xpath_text(driver, xpath, wait=100):
    return (
        WebDriverWait(driver, wait)
        .until(EC.presence_of_element_located((By.XPATH, xpath)))
        .text
    )


def expect_wait_status(
    name,
    un,
    driver,
    status_xpath,
    expected_terminal_status,
    expected_intermediary_status,
):
    status = wait_for_xpath_text(driver, status_xpath)

    while not status.upper() == expected_terminal_status.upper():
        log(
            f"[ { os.getpid() } @ { ct() } ] Polling found state of { name } as { status }."
        )
        time.sleep(2)
        if status.upper() != expected_intermediary_status.upper():
            print_and_log(
                "error",
                f"[ { os.getpid() } @ { ct() } ]",
                f"ERROR: Instance { name } using account { un } encountered status: { status } as opposed to expected { expected_intermediary_status }",
            )
            write_results(
                name,
                f"FAILED: terminated before made it to { expected_terminal_status } during { expected_intermediary_status }",
            )
            driver.close()
            exit()
        try:
            status = wait_for_xpath_text(driver, status_xpath)
        except:
            print_and_log(
                "warning",
                f"[ { os.getpid() } @ { ct() } ]",
                f"WARNING: Failed to get status once in { expected_intermediary_status }",
            )
