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


// funkcja dodaj jeden kontakt do bazy i listy
function add_one() {
  // jezeli blednie wypelnione formularze w module dodawnie nic nie rob
  if (validation_inp() === false) {
    return;
  } else {
    // pobranie danych z formularzy w module dodawanie
    let imie = $("input[name=name]").val().trim();
    let nazwisko = $("input[name=lastname]").val().trim();
    let telefon = $("input[name=phone]").val().trim();
    let grupa = $("select[name=group]").val().trim();
    communicat("on", "Dodaje kontakt do bazy");
    // zapytanie do serwera
    $.ajax({
      url: "http://localhost:8000/ado",
      contentType: "application/json",
      dataType: "json",
      processData: false,
      data: JSON.stringify({
        Imie: imie.charAt(0).toUpperCase() + imie.slice(1).toLowerCase(),
        Nazwisko: nazwisko.charAt(0).toUpperCase() + nazwisko.slice(1).toLowerCase(),
        Telefon: telefon.charAt(0).toUpperCase() + telefon.slice(1).toLowerCase(),
        Grupa: grupa.charAt(0).toUpperCase() + grupa.slice(1).toLowerCase(),
      }),
      type: "POST",
      success: async function (data) {
        try {
          const updateOneOnList = await add_one_db_dev(data);
          communicat_finised(`Kontakt ${data.Imie} ${data.Nazwisko} dodany do bazy`);
        } catch (e) {
          communicat_finised(`Błąd podczas dodawania kontaktu. Sprawdź konsole.`);
          console.log(e);
        }
      }
    });
  }
}
// funkcje po odpowiedzi / sukcesie serwera - async v
function add_one_db_dev(data) {
  return Promise.resolve(add_one_db(data))
}
// funkcje po odpowiedzi / sukcesie serwera
function add_one_db(data) {
  // jezeli brak kontaktow na liscie usun komunikat o tym z listy
  const cont = $("#results-list");
  let noData = $(".no-data");
  if (noData) {
    $(noData).remove();
  }
  // budowanie elementu kontaktu do dodania do listy
  let addedOneContact =
    `
        <div class="container single-result-cont" id=${data._id}>
          <div class="remove-contact" title="Usuń kontakt">
            <img src="./img/trash_icn.png" class="rm-icn-item" title="Usuń kontakt">
            <img src="./img/edit.png" class="edit-cnt" title="Edytuj kontakt">
            <img class="gr-img" src="./img/${data.Grupa.toLowerCase()}.png" title="Grupa: ${data.Grupa}">
          </div>
          <div class="row data-cont">
            <div class="col data-box">
              <div class="data">Imie</div>
              <div class="data-txt" title="Kopiuj">${data.Imie}</div>
            </div>
            <div class="col data-box">
              <div class="data">Nazwisko</div>
              <div class="data-txt" title="Kopiuj">${data.Nazwisko}</div>
            </div>
            <div class="col data-box">
              <div class="data">Telefon</div>
              <div class="data-txt" title="Kopiuj">${data.Telefon}</div>
            </div>
            <div class="col data-box">
              <div class="data">Grupa</div>
              <div class="data-txt" title="Kopiuj">${data.Grupa}</div>
            </div>
          </div>
        </div>
      `;
  cont.prepend(addedOneContact);
  // wylaczenie komunikatów, wyczyszczenie formularzy w module dodawanie, usunieie stylow edytowania
  alerts_off();
  cancel_updating();
  clear_inputs();
  // znajdz aktualnie dodany kontakt i dodaj klase, animacje
  let nowCreatedContact = $(cont).find(`.single-result-cont[id=${data._id}]`);
  setTimeout(()=>{$(nowCreatedContact).addClass("Hello");}, 300) 

  // eventy

  // klikniecie w dane użytkownika - kopiowanie danych do schowka
  $('.data-txt').on('click', function () {
    copy_txt(this);
  });

  // klikniecie w usun użytkownika w kontenerze dodanego kontaktu
  $('.rm-icn-item').on('click', function () {
    delete_one_dev(this);
  });

  // klikniecie w edytuj użytkownika w kontenerze kontaktu
  $('.edit-cnt').on('click', async function(){
    cancel_updating();
    add_inputs_to_udating_data(this);
  });
}



export {
  add_one
};