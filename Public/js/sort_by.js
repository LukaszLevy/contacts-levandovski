import {
    clear_inputs,
    communicat,
    communicat_finised,
    validation_inp,
    copy_txt,
    alerts_off,
    cancel_updating,
    add_inputs_to_udating_data,
  } from "../js/ovr-fun.js";
  import {
    delete_one_dev
  } from "../js/deleting.js";
  import { 
    fill_data_and_show_contacts
  } from '../js/get_db.js'
  
  
  // funkcja dodaj jeden kontakt do bazy i listy
  function sort_by() {
    
      // pobranie danych z formularzy w module dodawanie
      let by = $(`.sort-name-act`).attr('url-nm');
      let sort = $(`#sort-kind`).children('img').attr('url-nm');
      let limit = $("select[name=limit]").val()
      const wbyNext = (el)=>{
        if(el == 'Imie'){
            return 'Nazwisko'
        }else{
            return "Imie"
        }
      }
      if(by == '_id'){
          sort = -1;
      }
      let byNext = wbyNext(by);
      // zapytanie do serwera
      $.ajax({
        url: "/sort",
        contentType: "application/json",
        dataType: "json",
        processData: false,
        data: JSON.stringify({
          by: by,
          byNext: byNext,
          sort: sort,
          limit: limit,
        }),
        type: "POST",
        success: async function (data) {
          try {
            cancel_updating();
            const showContactsOnList = await fill_data_and_show_contacts(data);
            communicat_finised(`Posortowano i załadowano: ${data.length} kontakt(ów)`);
          } catch (e) {
            communicat_finised(`Błąd podczas dodawania kontaktu. Sprawdź konsole.`);
            console.log(e);
          }
        }
      });
  }

  export {
    sort_by
  }