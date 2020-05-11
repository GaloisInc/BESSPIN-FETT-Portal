# Python Local Script Debugging Environment Setup

Setup for VS Code is similar for mac or windows. The basics are as follows:

- Install VS Code Python extension
- Install Python (can be done via brew for mac)
- Install pip package manager
- From terminal: `python3 -m venv myenvname` This allows your packages to run in this specific envirnoment.
- `pip install boto3`
- Reload VS Code window.
- Have working aws cli **default** profile configured in your .credentials file.
- Execute script from green button in VS Code in upper right corner of opened script file.

## Gotchas

- You can directly pass your aws [credentials into a boto3 session](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html). If you wish to use your .credentials file, the python environment likes to only use the [default] profile. I have not figured out how to pass it a specific profile name (the VS Code AWS extension has no effect).
- You may be prompted for a few other dependencies when trying to install boto3 via pip. Just add whatever you are prompted for.
- Don't skip the python env step unless you want to mess with PATH settings and where python should look for your packages.

## Links

- [boto3 docs](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html)
- [aws examples. Thanks Brian!](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/sqs-example-using-queues.html)

## Extra Credit

`pip install pyboto3` for boto3 intellisense
