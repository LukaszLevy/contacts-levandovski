import {
    communicat, communicat_finised, checkListLength
} from "../js/ovr-fun.js";

// funkcja dodaj do bazy testowe kontakty - async
function get_trial_dev() {
    return Promise.resolve(get_trial());
}
// funkcja dodaj do bazy testowe kontakty 
function get_trial() {
    communicat('on', 'Dodaje kontakty z bazy testowej...');
    $.ajax({
        url: "http://localhost:8000/trial",
        contentType: "application/json",
        dataType: "json",
        type: "GET",
        success: function (data) {
            try {
                communicat('on' , data.info);
            } catch (e) {
                console.log(err);
            }
        }
    });
} // koniec funkcji dodaj do bazy, listy


export {
    get_trial_dev
};