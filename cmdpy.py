#! /usr/bin/env python

import subprocess

from flask import Flask, jsonify, render_template, request, send_from_directory

ALLOWED_COMMANDS = ("ls", "echo", "cat", "dir", "man",)

app = Flask(__name__, static_url_path="")


def validate_command(command):
    """
    Doesn't let user input whatever command he wants, it's to avoid
    running unwanted commands for deleting things.

    :param command: O.S. command tu run
    """
    if command not in ALLOWED_COMMANDS:
        raise Exception(f"You're not allowed to use: {command}")


@app.route("/")
def root():
    return render_template("index.html")


@app.route("/static/<path:path>")
def send_statics(path):
    return send_from_directory("static", path)


@app.route("/api/commands/")
def available_commands():
    return jsonify(
        commands=ALLOWED_COMMANDS
    )


@app.route("/api/cmd/")
def custom_command():
    raw_command = request.args.get("cmd")
    command = raw_command.split()  # example: "ls -oh" will be ["ls", "-oh"]
    try:
        validate_command(command[0])
        result = subprocess.run(command, capture_output=True)
        return jsonify(
            command=raw_command,
            result=result.stdout.decode(),
        )
    except Exception as ex:
        return jsonify(
            command=raw_command,
            result=str(ex),
        ), 400


if __name__ == "__main__":
    app.run()
