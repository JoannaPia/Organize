// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            headers: {
              "Content-type": "application/json"
            },
            credentials: 'same-origin',

        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },

    _api_post: function (url, data, callback) {
       // console.log(data, "przed post")
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            headers: {
              "Content-type": "application/json"
            },
            credentials: 'same-origin',
            body: JSON.stringify(data),

        })
        .then(response => response.json())
          // parse the response as JSON
        .then(json_response => (callback(json_response)));  // Call the `callback` with the returned object
    },

    init: function () {
    },

    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards
        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
           // console.log(response);
            callback(response);
        });
    },

    getBoard: function (boardId, callback) {

        // the board is retrieved and then the callback function is called with the board
        this._api_get('/get-cards/', boardId, (response) => {
            this._data['cards'] = response;
             console.log(boardId," apii callback")
            console.log(response, "cards")
            callback(response, boardId);
        });
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
         this._api_get('/get-statuses', (response) => {
            this._data['statuses'] = response;
            console.log(response);
            //return response;
            callback(response);
        });
    },

    getStatusesBoard: function (boardId, callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
         this._api_get('/get-statuses/'+boardId, (response) => {
            this._data['statuses'] = response;
            //return response;
            callback(response);
        });
    },


    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
        this._api_get('/get-status/' + statusId, (response) => {
            this._data['statuses'] = response;
            callback(response);
        });
    },

    getCardsByBoardId: function (boardId, callback) {

        // the cards are retrieved and then the callback function is called with the cards
        this._api_get('/get-cards/'+boardId, (response) => {
            this._data['cards'] = response;
            //return response;
            callback(response, boardId);
        });
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardData, callback) {
        // creates new board, saves it and calls the callback function with its data
         this._api_post('/create-new-board', boardData, callback)
       /* this._api_post('/create-new-board', boardData, response=>{
            this._data['boards'] = response; //TODO cachedata
            console.log(boardData, "board data")
            console.log(response, "co to resposne");
            callback(response);*/
       // });
    },
    createNewCard: function (boardId, data, callback) {
        // creates new card, saves it and calls the callback function with its data
        this._api_post("/add-new-card/"+boardId, data, callback)
    },

     createNewColumn: function (boardId, data, callback) {
        console.log(boardId)
        // creates new card, saves it and calls the callback function with its data
        this._api_post("/add-new-column/"+boardId+"/", data, callback);
    },

    deleteBoard: function (boardId, callback) {
      //  console.log(boardId);
        this._api_post('/delete-board/' + boardId, boardId, callback)
    },

    boardTitleChange: function (boardId, boardData, callback){
       // console.log(boardData);
        this._api_post("/change-board-title/"+boardId, boardData, callback)
    },

    cardTitleChange: function (cardId, data, callback){
        console.log(data)
        this._api_post("/change-card-title/"+cardId, data, callback)
    },

    statusTitleChange: function (statusId, newTitle, callback){
         let data = {
             "status_id": statusId,
             "title" : newTitle
         }
        this._api_post("/change-status-title/", data, callback);
    },

   deleteCard: function (cardId, callback) {
        console.log(cardId, 'Data handler ID');
        this._api_post('/delete-card/' + cardId, cardId, callback);
    },
    deleteColumn: function (boardId, statusId, callback) {
        console.log(statusId, 'Data handler ID column');
        this._api_post('/delete-column/' + boardId, statusId, callback);
    },

    updateCardStatus: function(cardId, statusIdNew, boardId, callback) {
        let data = {
            "status_id" : statusIdNew,
        };
        this._api_post('/update-card-status/' + cardId, data, callback);
    }
};


