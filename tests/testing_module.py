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


def print_and_log(type, header, text):
    # log
    with open("log.txt", "a") as f:
        f.write(header + text + "\n")
        f.close()

    # print in color
    if type == "error":
        print(colored(header, "red") + text)
    if type == "message":
        print(colored(header, "green") + text)
    if type == "command":
        print(colored(header, "cyan") + text)
    if type == "warning":
        print(colored(header, "yellow") + text)
    if type == "special":
        print(colored(header, "magenta") + text)


def write_results(name, string):
    with open("results.txt", "a") as f:
        now = datetime.now()
        f.write("[ " + now.strftime("%H:%M:%S") + "] : " + name + " : " + string + "\n")
        f.close()
