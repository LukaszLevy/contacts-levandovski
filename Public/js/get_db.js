import {
  communicat,
  communicat_finised,
  copy_txt,
  empty_base,
  add_inputs_to_udating_data,
  cancel_updating
} from "../js/ovr-fun.js";
import {
  delete_one_dev
} from "../js/deleting.js";



// funkcja pobierz cala baze do async
function get_all_contacts_dev() {
  return Promise.resolve(get_all_contacts());
}
// funkcja pobierz cala baze 
function get_all_contacts() {
  
  communicat("on", "Ładuję kontakty");
  $.ajax({
    url: "/db",
    contentType: "application/json",
    dataType: "json",
    type: "GET",
    success: async function (data) {
      try {
        cancel_updating();
        const showContactsOnList = await fill_data_and_show_contacts(data);
        communicat_finised(`Załadowano: ${data.length} kontakt(ów)`);
      } catch (e) {
        communicat_finised(`Błąd przy pobieraniu kontaktów z bazy. Sprawdź w konsoli`);
        console.log(e);
      }
    }
  })
} // koniec funkcji pobierz wszystkie kontakty 

// funkcje po odpowiedzi / sukcesie serwera async
function fill_data_and_show_contacts(data) {
  return Promise.resolve(
    createContactList(data)
  )
  // funkje po odpowiedzi / sukcesie serwera - budowanie listy kontaktow, stylowanie
  function createContactList(data) {
    const cont = $("#results-list");
    // jezeli odpoweidz z serwera pusta - dodanie do listy wynikow pustego eletu - info
    if (data.empty) {
      cont.html("");
      empty_base();
    } else {
      cont.html("");
      // zbudowanie kontaktow z otrzymanych danych - dodanie elemntow dokumentu - kontaktow do listy 
      $.each(data, (index, value) => {
        for (const [key, val] of Object.entries(data[index])) {
          if (key == "_id") {
            let a = `
                <div class="container single-result-cont" id=${val}>
                  <div class="remove-contact">
                    <img src="./img/trash_icn.png" class="rm-icn-item" title="Usuń kontakt">
                    <img src="./img/edit.png" class="edit-cnt" title="Edytuj kontakt">
                  </div>
                  <div class="row data-cont"></div>
                </div>
              `;
            cont.append(a);
          } else {
            let b = `
                <div class="col data-box">
                  <div class="data">${key}</div>
                  <div class="data-txt" title="Kopiuj">${val}</div>
                </div>
              `;
            let c = $(`.data-cont`);
            $(c[index]).append(b);
          }
        }
      });
    }

    // dodanie aniamcji, ustawienie poprawnego obrazu dla grupy kontaktu
    $(".single-result-cont").each(function (index, element) {
      setTimeout(() => {
        $(element).addClass("Hello");
        let a = $(element).find(`.data:contains('Grupa')`).siblings('.data-txt').text().toLocaleLowerCase();
        let img = `<img class="gr-img" src="./img/${a}.png" title="Grupa: ${a}">`;
        $(element).find('.remove-contact').append(img);
      }, 50 + index * 30);
    });

    // eventy 

    // kliknięcie w usun kontakt w kontenerze kontaktu
    $(".rm-icn-item").on("click", function () {
      delete_one_dev(this);
    });

    // kliknięcie w edytuj kontakt w kontenerze kontaktu
    $('.edit-cnt').on('click', async function(){
      cancel_updating();
      add_inputs_to_udating_data(this);
    });

    // klkniecie w dane uzykownika w kontenerze kontaktu - kopiowanie danych do schowka
    $(".data-txt").on("click", function () {
      copy_txt(this);
    });

    
  }
} // koniec funkcji po odpowiedzi serwera



export {
  get_all_contacts_dev,
  fill_data_and_show_contacts
};