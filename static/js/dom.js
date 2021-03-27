// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        const createButton = document.createElement("button");
        createButton.classList.add("createbutton");
        createButton.innerText = "Create new board";
        createButton.classList.add("btn");
        createButton.classList.add("btn-dark");
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
            addColumnButton.classList.add("btn");
            addColumnButton.classList.add("btn-dark");


            board.appendChild(addColumnButton);

            addColumnButton.addEventListener('click', function (e) {
                //let boardId = addColButton.id.match(/[0-9]/g);
                dom.addNewColumn(board_id);
            });
            //-----------------------
            for (let status of statuses) {
                let cardBoards = '';
                statusBoard += `<div  id="${board_id}_status${status.id}" class="statusForBoard container col">
                                        <div id="status_${status.id}"><h3 class="changeStatus">${status.title}</h3> 
                                        <div class="row">
                                            <div class="col">
                                                <button id="${board_id}addNewCardButton" class="addcard btn btn-dark">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                                         <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div id='delete_board_${board_id}_status_${status.id}'  class="containerForButtons col-sm">
                                                <button class="btn btn-outline-danger" >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>   
                                  </div>
                                   <div id="status${status.id}">                    
                                       
                                `;
                for (let card of cards) {
                    if (card.status_id == status.id) {
                        cardBoards += `<div class="draggableCard row" draggable="true" data-id="${card.id}" data-status_id="${status.id}">
                                            <div class="col">
                                           <p id = "${card.board_id}_card${card.id}" class="${board_id}_status${status.id} col">${card.title}</p>
                                               </div>
                                               <button class="deleteCards btn btn-outline-danger col-2-sm" id="card${card.id}" >
                                                   <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                                         <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                                   </svg>
                                               </button>
                                           
                                       </div>`
                    }
                }

                statusBoard += cardBoards;
                statusBoard += `</div></div>`;
            };
            let showCards = document.getElementById(board_id);
            const divMain = document.createElement('div');
            divMain.classList.add('statusBoard');
            divMain.classList.add('row');
            divMain.innerHTML = statusBoard;

            showCards.append(divMain)

            let cardTitles = document.getElementById(board_id).getElementsByTagName("p");

            for (let cardTitle of cardTitles){
                cardTitle.addEventListener("click", function(event){
                    let cardTitleId = cardTitle.id
                    let cardTitleClass = cardTitle.className
                    // console.log(cardTitleId)
                    dom.cardTitleChange(cardTitleId, cardTitleClass, board_id)
                })
            };


            let cardsFromBoard = document.getElementById(board_id).querySelectorAll(".draggableCard");

            for(let card of cardsFromBoard){

                card.addEventListener("drag", function(event){
                    //card = event.target;
                });

                card.addEventListener("dragover", function(event){
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                });

                card.addEventListener("dragstart", function(event){
                    console.log("Dragstart:")
                    event.currentTarget.classList.add("currDragged");
                    //event.currentTarget.classList.remove("row");
                    let board = document.getElementById(board_id);
                    // OK
                    console.log(event.currentTarget.dataset.id);
                    event.dataTransfer.setData('idCard', event.currentTarget.dataset.id);

                    let statuses = board.querySelectorAll(".statusForBoard");
                    for (let status of statuses){
                        let statusId = status.id.match(/-?\d(?:[,\d]*\.\d+|[,\d]*)/g)[1];
                        if (event.currentTarget.dataset.status_id != statusId)
                            status.classList.add('dropzone');
                    }

                });

                card.addEventListener("dragend", function(event){
                    console.log(event.dataTransfer.getData("idCard"));
                    event.currentTarget.classList.remove("currDragged");
                    //event.currentTarget.classList.add("row");
                    let statuses = document.getElementById(board_id).querySelectorAll(".statusForBoard");
                    for (let status of statuses){
                        status.classList.remove('dropzone');
                    }
                });
            }

            let i = 0;

            for(i; i < divMain.childNodes.length; i++){
                let statusColumn = divMain.childNodes[i].lastChild
                statusColumn.ondragenter = function(event){
                    event.preventDefault();
                    console.log("dragEnter");
                  //  event.currentTarget.style.backgroundColor = "red";
                };

                statusColumn.ondragleave = function(event){
                    console.log("dragLeave");
                    event.preventDefault();
                 //   event.currentTarget.style.backgroundColor = "white";
                };

                statusColumn.ondrop = function(event){
                    console.log("Drop");
                   event.preventDefault();
                   if (event.currentTarget.classList.contains("dropzone"))
                   {
                       let data = event.dataTransfer.getData("idCard");
                        console.log(data);
                        let draggedCard = document.querySelector(".currDragged");
                        let cardId = draggedCard.dataset.id;

                        let finalColumnId = event.currentTarget.id.match(/-?\d(?:[,\d]*\.\d+|[,\d]*)/g)[1];

                        let statusId = draggedCard.dataset.status_id;
                        dataHandler.updateCardStatus(cardId, finalColumnId,function() {
                                    let dragCard = document.querySelector(".currDragged")

                                    let oldStatusId = document.getElementById(board_id + 'status_'+statusId);
                                    let newStatusId = document.getElementById(board_id + 'status_'+finalColumnId);
                                    oldStatusId.removeChild(dragCard);
                                    newStatusId.appendChild(finalColumnId);
                         });
                   }
                };
        /*
                statusColumn.addEventListener("dragenter", function(event){
                    //event.preventDefault();
                    // let ele = event.currentTarget;

                    //if (ele.className == 'dropzone'){
                    //}

                });

                statusColumn.addEventListener("dragleave", function(event){
                    //event.preventDefault();
                    console.log("DragLeave " + event.currentTarget.id);
                     let ele = document.getElementById(event.currentTarget.id);

                });


               statusColumn.addEventListener("drop", function(event){
                   event.preventDefault();
                    console.log(event.currentTarget);
                   if (event.currentTarget.classList.contains("dropzone"))
                   {
                       let data = event.dataTransfer.getData("idCard");
                        console.log(data);
                        let draggedCard = document.querySelector(".currDragged");
                        console.log(draggedCard);
                        let cardId = draggedCard.dataset.id;

                        let finalColumnId = event.currentTarget.id.match(/-?\d(?:[,\d]*\.\d+|[,\d]*)/g)[1];

                        let statusId = draggedCard.dataset.status_id;
                        console.log(cardId);
                        console.log(statusId);
                        dataHandler.updateCardStatus(cardId, finalColumnId,function(response) {
                                    let dragCard = document.querySelector(".currDragged")

                                    let oldStatusId = document.getElementById(board_id + 'status_'+statusId);
                                    let newStatusId = document.getElementById(board_id + 'status_'+finalColumnId);
                                    oldStatusId.removeChild(dragCard);
                                    newStatusId.appendChild(finalColumnId);
                         });
                        console.log(finalColumnId);

                   }

                });

         */

            }

            let deleteCards = document.querySelectorAll('.deleteCards');
            // console.log(deleteCards)
            for (let deleteCard of deleteCards) {
                deleteCard.onclick = dom.eventClickDeleteCards;
            }

            let createButton = document.getElementById(board_id+"addNewCardButton")

            createButton.addEventListener('click', function (event) {
                dom.addNewCard(board_id);
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

    cardTitleChange: function (cardTitleId, cardTitleClass, board_id){
        let cardTitle = document.getElementById(cardTitleId)
        let parent = cardTitle.parentNode
        let input = `
            <input class="input-group input-group-sm mb-3" type="text" placeholder="Enter card name" class="changingCardTitle" id="${board_id}input${cardTitleId}"> 
        `
        parent.removeChild(cardTitle)
        parent.insertAdjacentHTML("afterbegin", input)
        let inputEvent = document.getElementById(board_id+'input'+cardTitleId)
        inputEvent.addEventListener('keydown', function(event){
            if (event.key === 'Enter') {
                let data = {
                    cardNewTitle: inputEvent.value,
                    cardId: cardTitleId
                }
                dataHandler.cardTitleChange(cardTitleId, data, (response)=>{
                    let title = `
                        <p id = "${cardTitleId}" class="${cardTitleClass}">${data["cardNewTitle"]}</p>
                    `
                    parent.removeChild(inputEvent)
                    parent.insertAdjacentHTML("afterbegin", title)
                    let cardNewTitle = document.getElementById(cardTitleId)
                    cardNewTitle.addEventListener("click", function(event){
                    dom.cardTitleChange(cardTitleId, cardTitleClass, board_id)
                })
                    console.log(response)
                })
            }
        })
        // inputEvent.addEventListener('click', function(event){
        //     dom.showBoard(cards, board_id)
        // })
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
            <input class="input-group input-group-sm mb-3" type="text" id="changingStatusTitle" name="changingStatusTitle">
            <button type="button" id="changingStatusTitleButton" class="btn btn-dark">Save</button>
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
            let newCard = `<div class="draggableCard row" draggable="true" >
                                 <div class="col">
                                <p id = "${response.board_id}_card${response.id}" class="${response.board_id}_status${response.status_id}"> 
                                         ${response.title}</p>
                                  </div>
                                <button class="deleteCards btn btn-outline-danger col-2-sm"  id="card${response.id}" >
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                     <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                               </svg></button>
                           </div>`
            newContainer.insertAdjacentHTML("beforeend", newCard)
            let deleteCard = document.getElementById("card"+response.id)
            deleteCard.onclick = dom.eventClickDeleteCards;
            let cardTitleId = response.board_id+'_card'+response.id
            let cardTitleClass = response.board_id+'_status'+response.status_id
            let cardTitleChange = document.getElementById(cardTitleId)
            console.log(cardTitleChange)
            cardTitleChange.addEventListener('click', function(event){
                dom.cardTitleChange(cardTitleId, cardTitleClass, boardId)
            })

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
                            <div class="row-12">
                            <div class="col-sm">
                              <button id="${boardId}addNewCardButton" class="addcard btn btn-dark"> 
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                 <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                              </svg></button></div>
                       <div id="delete_board_${boardId}_status_${response.id}" class="containerForButtons col-sm">
                      <button class="btn btn-outline-danger">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                    </svg></button></div>
                    </div>
                 </div>                          
                `;
            console.log(newStatusColumn);

            let newColumn = document.createElement('div');
            newColumn.id =`${boardId}_status${response.id}`;
            newColumn.classList.add("statusForBoard");
            newColumn.classList.add("container");
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
                <div id="boardTitle${board.id}" class="title" ><h1>${board.title}</h1></div>
                </div>
               <button class="showColumn btn btn-dark" type="button" id='openButton${board.id}'>Show board</button>
               <button class="deleteBoard btn btn-dark" id='deleteButton${board.id}'>Delete board</button>
    
                   </div>
                 
           `;

        }


        const outerHtml = `
            <div class="board-container container">
                ${boardList}
            </div>
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
        button.classList.add("btn");
        button.classList.add("btn-dark");
        button.setAttribute("type", "button");
        button.addEventListener('click', ()=> {
            const boardData = {
                title: input.value,
                boardId: boardId
            };
            dataHandler.boardTitleChange(boardId, boardData, (response)=>{
                console.log(response);
                let boardTitle = document.getElementById("boardTitle"+response)
                boardTitle.innerHTML = boardData["title"]
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
        expandButton.innerText = 'Hide board';
        dom.loadBoard(result);
    },

    closeBoard: function (e){
        let currId = e.currentTarget.id;
        let boardId = currId.match(/[0-9]/g);
        let result = boardId.join('');

        let closingBoard = document.getElementById(result);
        closingBoard.removeChild(closingBoard.lastChild);

        let expandButton = document.getElementById('openButton'+result);
        expandButton.innerText = 'Show Board';
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
                        <div id="boardTitle${response}" class="title" ><h1>${boardData['title']}</h1></div>
                    </div>
                    <button class="showColumn btn btn-dark" id='openButton${response}'>Show board</button>
                    <button class="deleteBoard btn btn-dark" id='deleteButton${response}'>Delete board</button>
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
         let parentCardDelete = cardToDelete.parentNode;

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
