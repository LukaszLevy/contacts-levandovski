import {
  communicat,
  communicat_finised,
  empty_base
} from "../js/ovr-fun.js";


// funkcja usun cala baze - async
function delete_all_dev() {
  return Promise.resolve(delete_all());
}
// Usuń całą bazę danych
function delete_all() {
  communicat("on", "Usuwam całą bazę danych");
  $.ajax({
    url: "http://localhost:8000/del",
    contentType: "application/json",
    dataType: "json",
    processData: false,
    type: "POST",
    success: async function (data) {
      try {
        communicat('on' , data.info);
      } catch (e) {
        communicat_finised(`Błąd: Baza nie usunięta`);
        console.log(err);
      }
    }
  });
}



// usuwanie jednego kontaktu - async
function delete_one_dev(el) {
  return Promise.resolve(delete_one(el));
}
// Usuń pojedyńczy kontakt z bazy
function delete_one(el) {
  communicat(`on`, `Usuwam kontakt`);
  // pobranie danych z aktualnie usuwanego kontaktu, ustalenie aktualnego elementu
  let currentId;
  let currentIndex = $(el).index('.rm-icn-item');
  let a = $(`.single-result-cont`);
  let currentEl = a[currentIndex];
  currentId = $(a[currentIndex]).attr('id');
  // zapytanie do serwera
  $.ajax({
    url: "http://localhost:8000/do",
    contentType: "application/json",
    dataType: "json",
    type: "POST",
    data: JSON.stringify({
      id: currentId
    }),
    success: async function (data) {
      try {
        const updtaeList = await delete_one_from_list_dev(currentEl);
        communicat_finised("Usunięto kontakt");
      } catch (e) {
        communicat_finised('Błąd podczas usuwania kontaktu. Sprawdź konsole.')
        console.log(e);
      }
    }
  });
};

// funkcja po odpowiedzi / sukcesie serwera - async
function delete_one_from_list_dev(currentEl){
  return Promise.resolve(delete_one_from_list(currentEl))
}
// funkcja po odpowiedzi / sukcesie serwera
// animacja usuniecia jedengo elementu, usuniecie, jezeli to byl ostatni na liscie  - komunikat o pustej liscie
function delete_one_from_list(currentEl){
  
  $(currentEl).addClass('Hello2');
  setTimeout(()=>{
    $(currentEl).remove();
    if ($('#results-list').children().length == 0) {
      empty_base();
    }
  }, 300)
  
}


// usuwanie wielu kontaktow async
function remove_selected_from_db_dev( arr ) {
  return Promise.resolve( remove_selected_from_db(arr) );
}
// usuwanie wielu kontaktow
function remove_selected_from_db(arr) {
  communicat(`on`, `Usuwam wybrane kontakty z bazy`);
  $.ajax({
    url: "http://localhost:8000/dm",
    contentType: "application/json",
    dataType: "json",
    type: "POST",
    data: JSON.stringify({
      id: arr
    }),
    success: async function (data) {
      try{
        const updateContactList = await find_and_remove_dev(arr);
        communicat_finised(data.info);
      }catch(e){
        communicat_finised(`Błąd podczas usuwania kontaktów. Sprawdz konsole`);
        console.log(e);
      }
    }
  });
} // usun wiele

// funkcje po odpowiedzi serwera / sukcesie, arr - tablica id stworozna w innej funkcji
function find_and_remove_dev(arr){
  return Promise.resolve( find_and_remove(arr) )
}
function find_and_remove(arr) {
  $.each(arr, function (k, v) {
    let elToRemove = $(`.single-result-cont[id="${v}"]`);
    $(elToRemove).addClass('deleted-selected');
    setTimeout(() => {
      $(elToRemove).remove();
      // dodanie komunikatu o pustej liscie jezeli lista jest pusta
      if (!$('#results-list').children().length) {
        empty_base();
      }
    }, 500);
  })
} // usuwanie wielu el - fn pomocnicza



export {
  delete_all_dev,
  delete_one_dev,
  remove_selected_from_db_dev
};