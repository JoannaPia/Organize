import { dom } from "./dom.js";

function openBoard(board_id){
    dom.loadBoard(board_id);
}

// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();
}

init();



