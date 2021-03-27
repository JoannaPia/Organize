// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        const createButton = document.createElement("button");
        createButton.classList.add("createbutton");
        createButton.innerText = "Create new board";
        document.body.appendChild(createButton);
        createButton.onclick = this.createNewBoard

    },

    getStatuses: function (board_id) {
      dataHandler.getStatuses(function(statuses){

      });
    },

    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },

    loadBoard: function (board_id) {
        board_id = parseInt(board_id);
        dataHandler.getCardsByBoardId(board_id, this.showBoard);
    },

    showBoard: function (cards, board_id){

        let statusObj = [];

        dataHandler.getStatusesBoard(board_id, function(statuses) {
            statusObj = statuses;
            let statusBoard = '';

            // Insert addColumn button
            let board = document.getElementById(board_id);
            let addColumnButton = document.createElement("button");
            addColumnButton.id = `addColumnTo${board_id}`;
            addColumnButton.innerHTML = 'Add column';
            addColumnButton.classList.add('addColumnButton');

            board.appendChild(addColumnButton);

            addColumnButton.addEventListener('click', function (e) {
                //let boardId = addColButton.id.match(/[0-9]/g);
                dom.addNewColumn(board_id);
            });
            //-----------------------
            for (let status of statuses) {
                let cardBoards = '';
                statusBoard += `<div id="${board_id}_status${status.id}" class="statusForBoard">
                                        <div id="status_${status.id}"><h3 class="changeStatus">${status.title}</h3> 
                                        <button id="${board_id}addNewCardButton" class="addcard">Add new card</button>
                                        <div id='delete_board_${board_id}_status_${status.id}'  class="containerForButtons">
                                        <button>Delete column</button>
                                        </div>   
                                  </div>
                                                            
                                       
                                `;
                for (let card of cards) {
                    if (card.status_id == status.id) {
                        cardBoards += `<div class="draggableCard" draggable="true" data-id="${card.id}" data-status_id="${status.id}">
                                                        <p id = "${card.board_id}_card${card.id}" class="${board_id}_status${status.id}" > 
                                                        ${card.title} <button class="deleteCards" id="card${card.id}" >delete card</button>
                                          </p> </div>`
                    }
                }

                statusBoard += cardBoards;
                statusBoard += `</div>`;
            }
            let showCards = document.getElementById(board_id);
            const divMain = document.createElement('div');
            divMain.classList.add('statusBoard')
            divMain.innerHTML = statusBoard;

            showCards.append(divMain)

            let cardsFromBoard = document.getElementById(board_id).querySelectorAll(".draggableCard");
            for(let card of cardsFromBoard){

                card.addEventListener("dragstart", function(event, boardId){
                    event.currentTarget.classList.add("currDragged");

                });

                card.addEventListener("drag", function(event, boardId){

                });

                card.addEventListener("dragend", function(event, boardId){
                    event.currentTarget.classList.remove("currDragged");
                    console.log("DragEnd");
                });
            }

            for(let statusColumn of divMain.childNodes){
                // dodaje drop listnenera
                console.log("Dodal listenrera");
               statusColumn.addEventListener("drop", function(event, boardId){
                   console.log("Drop");
                    let finalColumnId = event.currentTarget.id;
                    let statusId = event.dataset.status_id;
                    console.log(statusId)

                    dataHandler.updateCardStatus(event.dataset.id, finalColumnId, (response)=> {
                                let dragCard = document.querySelector(".currDragged")

                                let oldStatusId = document.getElementById('status_'+statusId);
                                let newStatusId = document.getElementById('status_'+finalColumnId);
                                oldStatusId.removeChild(dragCard);
                                newStatusId.appendChild(finalColumnId);
                     });
                    console.log(finalColumnId);

                });
            }

            let deleteCards = document.querySelectorAll('.deleteCards');
            // console.log(deleteCards)
            for (let deleteCard of deleteCards) {
                deleteCard.onclick = dom.eventClickDeleteCards;
            }

            let createButton = document.getElementById(board_id+"addNewCardButton")
            createButton.addEventListener('click', function (event) {
                dom.addNewCard(board_id)
            })


            for (let status of statuses) {
                let id = `delete_board_${board_id}_status_${status.id}`
                let deleteButton = document.getElementById(id);
                deleteButton.onclick = dom.deleteColumn;

            }
            /*
                Edition of status title
                onclick event generates input and sends request to api
             */
            let statusChangeDivs = document.getElementById(board_id).getElementsByClassName('changeStatus');
            for (let statusChange of statusChangeDivs) {
                statusChange.addEventListener("click", dom.clickStatusTitleChange);
            }

        })

    },

    clickStatusTitleChange: function (e)
    {
        let ids = e.currentTarget.parentNode.id.toString().match(/[0-9]/g).join([]);
        console.log("Parent ID: "+ids);
        let status_id = ids;
        let changingStatusTitle = document.getElementById("changingStatusTitle");

        if(changingStatusTitle != null){

            let statusHeaderDiv = changingStatusTitle.parentNode.parentNode;
            // element to change (H3)
            let parentStatusChange = changingStatusTitle.parentNode;

            let statusId = parentStatusChange.parentNode.id.toString().match(/[0-9]/g).join([]);

            parentStatusChange.parentNode.removeChild(parentStatusChange);

            dataHandler.getStatus(statusId, function (response){
                    let title = response.title;
                    parentStatusChange.innerHTML = title;
                    statusHeaderDiv.prepend(parentStatusChange);
            });

            parentStatusChange.addEventListener("click", dom.clickStatusTitleChange);
        }

        let statusChangeButton = `
            <label for="changingStatusTitle">${e.currentTarget.innerHTML}</label>
            <input type="text" id="changingStatusTitle" name="changingStatusTitle">
            <button type="button" id="changingStatusTitleButton">Save</button>
        `;

        e.currentTarget.innerHTML = statusChangeButton;
        e.currentTarget.removeEventListener("click", dom.clickStatusTitleChange);
        document.getElementById("changingStatusTitleButton").addEventListener('click', function(){

            let newTitle = document.getElementById("changingStatusTitle").value;

            dataHandler.statusTitleChange(status_id, newTitle, function(){
                let changeTitleDiv = document.getElementById("status_" + status_id).querySelector(".changeStatus");

                changeTitleDiv.innerHTML = newTitle;

                changeTitleDiv.addEventListener('click', dom.clickStatusTitleChange);
            });
        });
    },

    addNewCard: function(boardId) {
        const data = {
            title: "New card",
            boardId: boardId
        };
        dataHandler.createNewCard(boardId, data, (response)=>{
            let newContainer = document.getElementById(response.board_id+"_status"+response.status_id)
            console.log(newContainer)
            let newCard = `<div class="draggableCard" draggable="true" >
                                <p id = "${response.board_id}_card${response.id}" class="${response.board_id}_status${response.status_id}" > 
                                         ${response.title} <button class="deleteCards" id="card${response.id}" >delete card</button>
                                </p> </div>`
            newContainer.insertAdjacentHTML("beforeend", newCard)
            let deleteCard = document.getElementById("card"+response.id)
            deleteCard.onclick = dom.eventClickDeleteCards;

        })
    },

    addNewColumn: function(boardId) {

       const data = {
            statusId: "New status",
            boardId: boardId
        };

        dataHandler.createNewColumn(boardId, data, (response)=>{
            let boardDiv = document.getElementById(boardId);
            let columnsDiv = boardDiv.querySelector(".statusBoard");
            console.log("Cols div: "+columnsDiv.lastChild);
            let newStatusColumn =
                `<div><h3 class="changeStatus">New status</h3></div> 
                        <div id="delete_board_${boardId}_status_${response.id}" class="containerForButtons">
                              <button>Delete column</button>
                              <button id="${boardId}addNewCardButton" class="addcard">Add new card</button>
                 </div>                          
                `;
            console.log(newStatusColumn);

            let newColumn = document.createElement('div');
            newColumn.id =`${boardId}_status${response.id}`;
            newColumn.classList.add("statusForBoard");
            newColumn.innerHTML = newStatusColumn;
            columnsDiv.appendChild(newColumn);

            let id = `delete_board_${boardId}_status_${response.id}`
            let deleteButton = document.getElementById(id);
            deleteButton.onclick = dom.deleteColumn;
        })

    },

    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardList = '';

        for (let board of boards) {
            boardList += `
                 <div id="${board.id}" class="board">
                <div id="${board.id}_title" class="board-title showCards">
                <li id="boardTitle${board.id}" class="title">${board.title}</li>
                </div>
               
               <button class="showColumn" type="button" id='openButton${board.id}'>show column</button>
               <button class="deleteBoard" id='deleteButton${board.id}'>delete board</button>
                     
                   </div>
                 
           `;

        }


        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        // Event listeners on Board Titles so they can be changed
        let boardTitles = document.querySelectorAll('.title');
        for (let boardTitle of boardTitles){
            boardTitle.addEventListener('click', function (event) {
            let boardId = boardTitle.id;
            dom.boardNameChange(boardId)
            })
        };

        // Event listeners on Board show buttons
        let showBoardButtons = document.querySelectorAll('.showColumn');
        //console.log(showBoardButtons)
        for (let showBoardButton of showBoardButtons) {
            showBoardButton.onclick = dom.openBoard;
        }

        // Event listeners on deleteBoard buttons
        let deleteBoardButtons = document.querySelectorAll('.deleteBoard');
       // console.log(deleteBoardButtons)
        for (let deleteBoardButton of deleteBoardButtons){
            deleteBoardButton.addEventListener('click', function (event) {
                let boardId = deleteBoardButton.id;
                dom.deleteBoard(boardId)
            });
        };


        document.getElementById('progressBar').style.display = 'none';


    },

    getButtonId: function(id){

    },

    boardNameChange: function(boardId) {
        const create_button = document.querySelector('.createbutton')
        document.body.removeChild(create_button)
        console.log(boardId)
        const form = document.createElement('form');
        const input = document.createElement('input');
        const button = document.createElement('button');
        form.appendChild(input);
        form.appendChild(button);
        form.setAttribute('action', '/board-title-change/<boardId>');
        form.setAttribute('method', 'POST');
        form.setAttribute('id', 'form');
        document.getElementById("container").appendChild(form);
        document.getElementById("container").appendChild(button);
        button.innerText = 'Save';
        button.setAttribute("type", "button");
        button.addEventListener('click', ()=> {
            const boardData = {
                title: input.value,
                boardId: boardId
            };
            dataHandler.boardTitleChange(boardId, boardData, (response)=>{
                console.log(response);
                let boardTitle = document.getElementById("boardTitle"+response)
                boardTitle.innerText = boardData["title"]
                document.getElementById("container").removeChild(button);
                document.getElementById("container").removeChild(form);
                dom.init()
            });
        })
    },

    openBoard: function (e){

        let currId = e.currentTarget.id;

        let boardId = currId.match(/[0-9]/g);

        let result=boardId.join('');
        // Change button to different one (from expand to hide element)
        let expandButton = document.getElementById('openButton'+result);
        expandButton.onclick = dom.closeBoard;
        expandButton.innerText = 'hide column';
        dom.loadBoard(result);
    },

    closeBoard: function (e){
        let currId = e.currentTarget.id;
        let boardId = currId.match(/[0-9]/g);
        let result = boardId.join('');

        let closingBoard = document.getElementById(result);
        closingBoard.removeChild(closingBoard.lastChild);

        let expandButton = document.getElementById('openButton'+result);
        expandButton.innerText = 'show column';
        closingBoard.removeChild(closingBoard.lastChild);

        // Add new eventlistener so that the board collapses when clicked
        expandButton.onclick = dom.openBoard;
    },


    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },

    createNewBoard: function () {
        const create_button = document.querySelector('.createbutton')
        document.body.removeChild(create_button)
        const form = document.createElement('form');
        const input = document.createElement('input');
        const button = document.createElement('button');

        form.appendChild(input);
        form.appendChild(button);
        form.setAttribute('action', '/create-new-board');
        form.setAttribute('method', 'POST');
        form.setAttribute('id', 'form');
        document.getElementById("container").appendChild(form);
        document.getElementById("container").appendChild(button);
        button.innerText = 'Save';
        button.setAttribute("type", "button");
        button.addEventListener('click', ()=>{
            //
            dom.init()
            const boardData = {

                title: input.value
            };
            dataHandler.createNewBoard(boardData, (response)=>{
                console.log(response, "response data handler");
                let newBoard = `
                <div id="${response}" class="board">
                    <div id=${response} class="board-title">
                        <li id="boardTitle${response}" class="title">${boardData['title']}</li>
                    </div>
                    <button class="showColumn" id='openButton${response}'>showColumn</button>
                    <button class="deleteBoard" id='deleteButton${response}'>Delete board</button>
                </div>`;

                let boardsContainer = document.querySelector('.board-container');
                boardsContainer.insertAdjacentHTML("beforeend", newBoard);
                let deleteBoardButton = document.getElementById('deleteButton'+response);
                deleteBoardButton.addEventListener('click', function (event) {
                    let boardId = deleteBoardButton.id;
                    dom.deleteBoard(boardId)
                    });
                let boardTitleChange = document.getElementById("boardTitle"+response);
                boardTitleChange.addEventListener('click', function (event) {
                dom.boardNameChange(response)
                });
                let showBoardButtons = document.querySelectorAll('.showColumn');
                //console.log(showBoardButtons)
                for (let showBoardButton of showBoardButtons) {
                    showBoardButton.onclick = dom.openBoard;
                }
            })
            let element = document.getElementById('container');
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        })


    },

    afterClickButton: function (e){

    },

     deleteBoard: function(boardId){
        console.log(boardId)
        dataHandler.deleteBoard(boardId, (response)=>{
            console.log(response)
            let element = document.getElementById(response);
            console.log(element);
            let boardContainer = document.querySelector('.board-container')
            boardContainer.removeChild(element)
                console.log(response)
        })

    },

    eventClickDeleteCards: function (e) {
         let currId = e.currentTarget.id;
         let cardToDelete = document.getElementById(currId);
         let parentCardDelete = cardToDelete.parentNode.parentNode;

        let cardIds = currId.match(/[0-9]/g);
        let cardIdconverted = ''
        for(let cardId of cardIds) {
            cardIdconverted += cardId
        }
            console.log(cardIdconverted)
            dom.deleteCard(parentCardDelete, cardIdconverted)

    },

    deleteCard: function (parentCardDelete, cardId){

            dataHandler.deleteCard(cardId, function(response){
                    let temp = parentCardDelete.parentNode;
                    temp.removeChild(parentCardDelete);
           })

    },

    deleteColumn: function(e){
        let id = e.currentTarget.id;
        let ids = id.toString().match(/-?\d(?:[,\d]*\.\d+|[,\d]*)/g);
        let board_id = ids[0];
        let status_id = ids[1];
        dataHandler.deleteColumn(board_id, status_id, function(){
            let columnToDelete = document.getElementById(board_id + '_status' + status_id);
            columnToDelete.parentNode.removeChild(columnToDelete);
        });
    },


};
