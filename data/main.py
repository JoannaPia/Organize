from flask import Flask, render_template, url_for, request, redirect
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()

@app.route("/get-statuses")
@json_response
def get_statuses():
    """
    Get all statuses == amount of columns in each board
    """
    return data_handler.get_statuses()

@app.route("/get-status/<int:status_id>")
@json_response
def get_status(status_id):
    """
    Get all statuses == amount of columns in each board
    """
    return data_handler.get_status(status_id)

@app.route("/get-statuses/<int:board_id>")
@json_response
def get_statuses_board(board_id):
    """
    Get all statuses == amount of columns in each board
    """
    return data_handler.get_statutes_board(board_id)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/save-board-title/<int:board_id>", methods=["POST"])
def save_board_title(board_id):
    if request.method == 'POST':

        title = request.form['title']
        data_handler.update_board_title(board_id, title)
        # albo return render_template('index.html')
        return redirect(url_for('index'))


@app.route("/change-board-title/<board_id>", methods=["POST"])
@json_response
def change_board_title(board_id):
    if request.method == 'POST':
        data = request.json
        title = data["title"]
        board_id = board_id_conversion(board_id)
        data_handler.update_board_title(board_id, title)

        return board_id

@app.route("/change-status-title/", methods=["POST"])
@json_response
def change_status_title():
    if request.method == 'POST':

        data = request.json
        title = data["title"]
        status_id = data["status_id"]
        return data_handler.update_status_title(status_id, title)


@app.route("/update-card-status/<int:card_id>", methods=["POST"])
@json_response
def change_card_status(card_id):
    if request.method == 'POST':
        data = request.json()
        statusId = data['statusId']





@app.route("/delete-board/<board_id>", methods=["POST"])
@json_response
def delete_board(board_id):
    if request.method == 'POST':
        board_id = board_id_conversion(board_id)
        data_handler.delete_board(board_id)
        return board_id


def board_id_conversion(data):
    list_of_char = list(data)
    list_of_digits = []
    for char in list_of_char:
        if char.isdigit():
            list_of_digits.append(char)
    return "".join(list_of_digits)


@app.route("/add-new-card/<boardId>", methods=["POST"])
@json_response
def add_new_card(boardId):
    if request.method == 'POST':
        data = request.json
        return data_handler.add_new_card(data)

@app.route("/add-new-column/<int:boardId>/", methods=["POST"])
@json_response
def add_new_column(boardId):
    if request.method == 'POST':

        data = request.json
        test = data_handler.add_new_column(data)
        print(test)
        return test


@app.route("/delete-card/<int:cardId>", methods=["POST"])
@json_response
def delete_card(cardId):

    if request.method == 'POST':
        return data_handler.delete_card(cardId)


@app.route("/delete-column/<int:board_id>", methods=["POST"])
@json_response
def delete_column(board_id):
    if request.method == 'POST':
        return data_handler.delete_column(board_id, request.json)




@app.route("/create-new-board", methods=["POST"])
@json_response
def create_new_board():
    if request.method == 'POST':
        data = request.json
        data_handler.add_board(data)
        id = str(data_handler.greatest_board_id())


        return id


def main():
    app.run(debug=True, port=7014)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
