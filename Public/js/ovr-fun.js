import {
  delete_all_dev,
  remove_selected_from_db_dev
} from "../js/deleting.js";
import {
  get_all_contacts_dev
} from '../js/get_db.js'
import{
  update_one_dev
} from '../js/update_one.js'
import {
  get_trial_dev
} from "../js/get_trial.js";


const alerts_el = $(".alerts");

// kontrola ilosci kontaktow - max 100
function checkListLength(nmr){
  if($('#results-list').children().length >= nmr){
    return false
  }else{
    return true
  }
}

// komunikaty - pojawja sie w menu 
function communicat(onOff, txt) {
  $(`.icn-active`).click();
  // $('#menu').css('display', 'none');
  if (onOff == "on") {
    if ($('.add-active').children('.mask')) {
      $('.add-active').children('.mask').remove();
    }
    let b = `<div class="mask"><div>${txt}... </div><img class="spin" src="./img/spinner.png"></div>`;
    $('.add-active').append(b);
  } else {
    $('.add-active').children('.mask').remove();
    // $('#menu').css('display', 'flex');
  }
} // komunikat modulowy

// komunikaty z potwierdzeniem - pojawja sie w menu - trzeba kliknąc ok
function communicat_finised(txt) {
  $(`.icn-active`).click();
  // $('#menu').css('display', 'none');
  if ($('.add-active').children('.mask')) {
    $('.add-active').children('.mask').remove();
  }
  let a = `<div class="mask"><div>${txt}... </div><div class="comm-ok" title="Kliknij - zakończ">ok</div></div>`;
  $('.add-active').append(a);
  $(".mask div").on('click', () => {
    $('.add-active').children('.mask').remove();
    // $('#menu').css('display', 'flex');
  });
} // komunikat modulowy z potwierdzeniem



// funkcja komunikat o pustej bazie, liscie 
function empty_base() {
  const trEl =
    `
    <div class="container single-result-cont no-data">
      <div class="row data-cont empty-base">
        Brak danych - kliknij dwukrotnie aby dodać przykładową bazę kontaktów
        <img src="img/db-restore.png" title="Podwójne kliknięcie spowoduje dodanie do bazy przykładowych kontaktów" id="del-few-cnt" class="emp-bas-icn">
    </div>
  `;
  $('#results-list').append(trEl);
  $('.single-result-cont').addClass('Hello').css("color", "white");
  $('.emp-bas-icn').on('dblclick', async function(){
    // dogranie testowych konatktow do bazy
    const user = await get_trial_dev();
    // ponowne pobranie bazy kontaktow, aktualizacja listy kontaktow
    const books = setTimeout(async () => {
      await get_all_contacts_dev()
    }, 2000);
  })
} // koniec - informacja o braku danych w bazie - wyswietlana na liscie rezultatow


// alerty formularzy modulu dodawanie - pojawiaja sie w menu
function alerts(txt) {
  $(alerts_el).removeClass("alerts-show").html(" ");
  let close = `<div class="alert-close" title="Zamknij">x<div/>`;
  $(alerts_el).addClass("alerts-show").text(txt).append(close);
  $(".alert-close").on("click", function () {
    $(this).parent().removeClass("alerts-show").html(" ");
  });
} 
// wyłączenie alertow
function alerts_off() {
  $(alerts_el).removeClass("alerts-show").html(" ");
} // koniec - alerty formularzy modulu dodawanie - pojawiaja sie w menu 



// czyszczenie formularzy - modul dodawanie
function clear_inputs() {
  $("input[name=name]").val("");
  $("input[name=lastname]").val("");
  $("input[name=phone]").val("");
  $("select[name=group]").val("");
} // koniec funkcji czyszczenie inputow w module adding



// walidacje formularzy modulu dodawania po kliknieciu w dodaj
function validation_inp() {
  let imie = $("input[name=name]").val().trim();
  let nazwisko = $("input[name=lastname]").val().trim();
  let telefon = $("input[name=phone]").val().trim();
  let grupa = $("#gr").children("option:selected").val().trim();
  $(alerts_el).removeClass("alerts-info");
  switch (true) {
    case imie == "" || nazwisko == "" || telefon == "" || grupa == "":
      alerts("Żadne pole nie może pozostać puste");
      return false;
    case imie.length < 3 ||
    nazwisko.length < 3 ||
    imie.length > 25 ||
    nazwisko.length > 25:
      alerts("Pola imie / nazwisko: ilość znaków 3-25");
      return false;
    case telefon.length != 9:
      alerts("Pole telefon: wprowadź 9 cyfr");
      return false;
    
    default:
      return true;
  }
} 
// walidacje formularzy modulu dodawania w trakcie wpisywania
function input_key_up_validation(el, reverse) {
  let regex, txt;
  if (reverse) {
    regex = /^[0-9]+$/;
    txt = "Dozwolone cyfry";
  } else {
    regex = /^[a-zA-ZąĄćĆęĘłŁóÓśŚżŻźŹ -]+$/;
    txt = "Dozwolone litery";
  }
  let val = $(el).val();
  for (let i = 0; i < val.length; i++) {
    if (!regex.test(val[i])) {
      if ($(el).parent().children('.checker')) {
        $(el).parent().children('.checker').remove();
      }
      let a = `<div class="checker">${txt}</div>`;
      $(el).parent().append(a);
      $(el).val(val.slice(0, i));
    } else {
      if ($(el).parent().children('.checker')) {
        $(el).parent().children('.checker').remove();
      }
    }
  }
  $(el).on({
    blur: function () {
      if ($(this).parent().children('.checker')) {
        $(this).parent().children('.checker').remove();
      }
    }
  });
} // koniec - walidacja inputow modulu dodawanie


// funkcja informacje odnosnie wprowadzania danych w formularzach w module dodawanie
function info_inputs(el) {
  const information = {
    nm: `Pole imie: Tylko litery, ilość znaków: 3 - 25`,
    lnm: `Pole nazwisko: Tylko litery, ilość znaków: 3 - 25`,
    ph: `Pole telefon: Tylko cyfry, wprowadź 9 cyfr`,
    gr: `Pole grupa: Wybierz z listy`,
  };
  $(alerts_el).addClass("alerts-info");
  let currentInput = $(el).siblings("input").attr("id");
  let currentInput2 = $(el).siblings("select").attr("id");
  for (const property in information) {
    if (property == currentInput) {
      alerts(information[property]);
    }
    if (property == currentInput2) {
      alerts(information[property]);
    }
  }
} // koniec - funkcja informacje odnosnie wprowadzania danych w formularzach w module dodawanie


// funkcja walidacje inputow przy aktualizacji kontaktu
function validation_inp_update() {
  let imie = $("input[name=name-upd]").val().trim();
  let nazwisko = $("input[name=lastname-upd]").val().trim();
  let telefon = $("input[name=phone-upd]").val().trim();
  let grupa = $("#gr-upd").children("option:selected").val().trim();
  switch (true) {
    case imie == "" || nazwisko == "" || telefon == "" || grupa == "":
      alerts_update("Żadne pole nie może pozostać puste");
      return false;
    case imie.length < 3 ||
    nazwisko.length < 3 ||
    imie.length > 25 ||
    nazwisko.length > 25:
    alerts_update("Pola imie / nazwisko: ilość znaków 3-25");
      return false;
    case telefon.length != 9:
      alerts_update("Pole telefon: wprowadź 9 cyfr");
      return false;
    default:
      return true;
  }
} // walidacja inputow modulu dodawanie kontaktu po kliknięciu w przycisk dodaj

// funkcja alerty wyswietlane w ciele kontaktu 
function alerts_update(txt) {
  $(`.alerts-update`).removeClass("alerts-update-show").html(" ");
  let close = `<div class="alert-close" title="Zamknij">x<div/>`;
  $(`.alerts-update`).addClass("alerts-update-show").text(txt).append(close);
  $(".alert-close").on("click", function () {
    $(this).parent().removeClass("alerts-update-show").html(" ");
  });
} 
function alerts_off_update() {
  $(`.alerts-update`).removeClass("alerts-update-show").html(" ");
}// koniec funkcji alerty w module dodawanie kontaktow



// przełączanie menu
function active_menu(el) {
  $('#results-list').removeClass('rl-margin');
  $('.mask').remove();
  cancel_updating();
  $(el).parent().parent().find('.minimize').attr('src', `/img/min.png`);
  $('#menu').removeClass(`menu-js`);
  remove_select_option();
  remove_rem_comunicat();
  alerts_off();
  hide_show_delete_menu('show');
  $(el).parent().addClass('mn-active');
  $(el).parent().siblings('.menu-icn-cnt').removeClass('mn-active');
  $(el).parent().children('img').addClass('icn-active');
  $(el).parent().siblings('.menu-icn-cnt').children('img').removeClass('icn-active');
  let ci = $(el).parent().index('.menu-icn-cnt');
  let adding = $(".adding");
  let currentAdding = adding[ci];
  $(currentAdding).addClass('add-active');
  $(currentAdding).siblings('.adding').removeClass('add-active');
} // koniec - wskazniki aktualnie uzywanego modulu i wyswietlanie zawartosci powiazanej z menu



// funkcja zmien aktywna nazwe sortowania
function change_kind_sorting(el){
  el = $(el).children(`img`);
  if( $(el).attr(`title`) == `Rosnąco` ){
    $(el).attr( `title`, `Malejąco` );
    $(el).attr( `src`, `/img/sort-dsc.png` );
    $(el).attr(`url-nm`, -1 );
  }else{
    $(el).attr( `title`, `Rosnąco` );
    $(el).attr( `src`, `/img/sort-asc.png` );
    $(el).attr( `url-nm`, 1 );
  }
}



// funkcja zmien aktywna nazwe sortowania
function change_active_sort_name(el){
  $(el).addClass('sort-name-act');
  $(el).siblings('.sort-name').removeClass('sort-name-act');
}


// filtrowanie listy wynikow w module szukaj
function serach_items_on_list(el) {
  let filter = $(el).val().toLocaleLowerCase();
  let b = filter.toString();
  collect($('.data-cont'));
  // funkcja pomocnicza - pokazywanie lub ukrywanie na liscie wynikow kontaktow.
  function collect(d) {
    for (let i = 0; i < d.length; i++) {
      let find = $(d[i]).text().toLowerCase()
      if (find.includes(b)) {
        $(d[i]).parent().css('display', 'block');
      } else {
        $(d[i]).parent().css('display', 'none');
      }
    }
  }
} // koniec - wyszukaj i wyswietl na liscie rezultatow kontakty spelniajace kryteria wyszukiwania



// funkcja minimalizowania menu
function minimize(el) {
  $('#results-list').toggleClass('rl-margin');
  if ($('.minimize').attr('src') != `/img/max.png`) {
    $('.minimize').attr('src', '/img/max.png');
    $(`body`).find('.add-active').removeClass('add-active');
    $('#menu').addClass(`menu-js`);
  } else {
    $('#menu').removeClass(`menu-js`);
    let actualMenuActive = $(el).parent().siblings('.mn-active').index('.menu-icn-cnt');
    $('.minimize').attr('src', '/img/min.png');
    let actualModul = $(`body`).find('.adding');
    $(actualModul[actualMenuActive]).addClass('add-active');
  }
} // koniec - minimalizowanie okna menu



// usun cala baze
async function delete_base(el) {
  // jezeli brak kontaktow w bazie nic nie rob
  if (!$('#results-list').children('.Hello').attr('id')) {
    communicat_finised('Nie możesz usunąć kontaktów, ponieważ na liście nie znajduję się żaden kontakt.');
    // usun upating
    cancel_updating() 
    return;
  }

  // usun upating
  cancel_updating() 

  let txtA, txtB, txtC, idA, idB;
  txtA = 'Usunąć całą baze ?';
  txtB = 'Usuń baze';
  txtC = 'Nie usuwaj';
  idA = 'd-db';
  idB = 'not-d-db';

  // czyszczenie komunikatu menu usuwania
  remove_rem_comunicat();

  // ukryj menu usuwania
  hide_show_delete_menu();

  // dodaj komunikat dla usun baze
  add_rem_comunicat(txtA, txtB, txtC, idA, idB);

  // eventy
  // klik w usun baze
  $('#d-db').on('click', async function () {
    const deleteBase = await delete_all_dev();
    const getBase = setTimeout(async () => {
      await get_all_contacts_dev();
    }, 2000);
    remove_rem_comunicat();
    hide_show_delete_menu('show');
  }) // przycisk usun baze

  // klik w nie usuwaj bazy
  $('#not-d-db').on('click', function () {
    remove_rem_comunicat();
    hide_show_delete_menu('show');
  }) // przyciski nie usuwaj
} // usun cala baze



// komunikat po kliknieciu w usun baze - potwierdzenie
function add_rem_comunicat(a, b, c, d, e) {
  let com =
    `
        <div class="del-comm">${a}</div>
        <div class="del-base del-bs" id="${d}">${b}</div>
        <div class="del-base nd-base" id="${e}">${c}</div>
      `;
  $('.removing').append(com);
} // stworzenie i dodanie opcja dla usuwania 
function remove_rem_comunicat() {
  $('.removing').children('.del-base').remove();
  $('.removing').children('.del-comm').remove();
} // usuwanie opcji dla usuwania 



// pokaz lub ukryj zakladaki modulu usuwanie
function hide_show_delete_menu(opt) {
  if (opt == null) {
    $(`.removing`).find('figure').hide();
  } else {
    $(`.removing`).find('figure').show();
  }
} // funkcja usuwajaca style i zachowanie funkcji wybierz do usuniecia


// usun wiele kontaktow
function delete_many_contacts() {
  // jezeli brak kontaktow w bazie nic nie rob
  if (!$('#results-list').children('.Hello').attr('id')) {
    communicat_finised('Nie możesz usunąć kontaktów, ponieważ na liście nie znajduję się żaden kontakt.');
    // usun upating
    cancel_updating() 
    return;
  }

  // usun upating
  cancel_updating() 

  let txtA, txtB, txtC, idA, idB, arr;
  txtA = 'Wybierz i usuń kontakty';
  txtB = 'Usuń';
  txtC = 'Nie usuwaj';
  idA = 'd-slc-cnt';
  idB = 'not-d-slc-cnt';
  arr = [];

  // czyszczenie komunikatu menu usuwania
  remove_rem_comunicat();

  // ukryj menu usuwania
  hide_show_delete_menu();

  // dodaj komunikat dla usun baze
  add_rem_comunicat(txtA, txtB, txtC, idA, idB);

  // pokaz opcje wybierania elementow
  show_select_option();

  // eventy
  // klik w usun wybrane kontakty
  $('#d-slc-cnt').on('click', function () {
    if ($('#results-list').children('.sng-cnt-slc').length == 0) {
      return;
    } else
    remove_selected_from_db_dev(arr);
    remove_select_option();
    remove_rem_comunicat();
    hide_show_delete_menu('show');
  }) // przycisk usun baze

  // klik w nie usuwaj wielu
  $('#not-d-slc-cnt').on('click', function () {
    remove_select_option();
    remove_rem_comunicat();
    hide_show_delete_menu('show');
  }) // przyciski nie usuwaj

  // klik w znaczniki wyboru elementu do usuniecia
  $('.check-icn').on('click', function () {
    select_elements_to_remove(this, arr);
  }) // przyciski wybierz
} // usun wybrane kontakty



// pokaz znaczniki do usuwania wielu kontaktow
function show_select_option() {
  // element ikona usuwania dodawana do kontaktu
  let check =
    `
        <div class="check-del">
          <img class="check-icn" src="./img/check.png" title="Wybierz do usnięcia">
        </div>
      `;
  // jeżeli ikony zaznaczania istnieja - powrót
  if ($('.single-result-cont').children('.check-del').length != 0) {
    return;
  } else
    // dodanie do kazdego kontaktu ikon wybierania
    $('.single-result-cont').each(function (i, e) {
      $(e).append(check);
      $(e).children('.remove-contact').hide();
    })
} //funkcja pomocnicza - dodanie opcji zaznaczania do kontaktu



// usuwanie znacznikow 
function remove_select_option() {
  $(`.check-del`).remove();
  $('.remove-contact').show();
  $('.single-result-cont').removeClass('sng-cnt-slc');
} //funkcja usun opcje zaznaczenia



// wybieranie konatktow do usniecia
function select_elements_to_remove(el, arr) {
  // zmien ikone wybierania, styluj kontakt po zaznaczeniu, pobierz element i przekaz do tablicy
  let a = $(el).attr('src');
  if (a == `./img/check.png`) {
    $(el).attr('src', './img/check-act.png');
    $(el).parent().parent('.single-result-cont').addClass('sng-cnt-slc');
    let id = $(el).parent().parent('.single-result-cont').attr('id');
    arr.push(id);
  } // kilkniecie w ikone wybierania
  // zmien ikone wybierania, styl odznaczenie, usun id odznaczonego elementu z tablicy
  else if (a == `./img/check-act.png`) {
    $(el).attr('src', './img/check.png');
    $(el).parent().parent('.single-result-cont').removeClass('sng-cnt-slc');
    let id = $(el).parent().parent('.single-result-cont').attr('id');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === id) {
        arr.splice(i, 1);
      }
    }
  } // ponowne klikniecie w ikone wybierania
} // funkcja zaznaczenie el. do usuniecia, zmiana stylu po zaznaczeniu



// funkcja schowek
function copy_txt(el) {
  let child = `<div class='copy-info'>Skopiwano</div>`;
  $(el).addClass("data-txt-click");
  setTimeout(() => {
    $(el).removeClass("data-txt-click");
  }, 100);
  setTimeout(() => {
    $(el).children().remove();
  }, 500);
  $(el).prepend(child);
  let a = el.childNodes[1].textContent;
  $(".copy-cont").val(a);
  $(".copy-cont").select();
  document.execCommand("copy");
} // koniec - kopiowanie pojedyńczych danych kontaktu do schowka



function add_inputs_to_udating_data(el) {
  // usun z kontenera input updating
  let curIndx = $(el).index('.edit-cnt');
  const cont = $('.single-result-cont');
  let actImie = $(cont[curIndx]).find('.data:contains("Imie")').siblings('.data-txt').text();
  let actNazwisko = $(cont[curIndx]).find('.data:contains("Nazwisko")').siblings('.data-txt').text();
  let actTelefon = $(cont[curIndx]).find('.data:contains("Telefon")').siblings('.data-txt').text();
  let actGrupa = $(cont[curIndx]).find('.data:contains("Grupa")').siblings('.data-txt').text();
  console.log(actImie, actGrupa, actNazwisko, actTelefon);
  let elInputs =
    `
      <div class="updating-inputs-cont">
      
      <div class="col my-inputs-box">
        <input type="text" class="form-control" name="name-upd" id="nm-upd" aria-describedby="helpId" placeholder="Imię" value="${actImie}" minlength="3" maxlength="25">
      </div>
      <div class="col my-inputs-box">
        <input type="text" class="form-control" name="lastname-upd" id="lnm-upd" aria-describedby="helpId" placeholder="Nazwisko" value="${actNazwisko}" minlength="3" maxlength="25">
      </div>
      <div class="col my-inputs-box">
        <input type="text" class="form-control" name="phone-upd" id="ph-upd" aria-describedby="helpId" placeholder="Telefon" value="${actTelefon}" minlength="9" maxlength="9">
      </div>
      <div class="col my-inputs-box">
        <select class="form-control form-control" name="group-upd" id="gr-upd">
          <option value="${actGrupa}" selected hidden>${actGrupa}</option>
          <option value="Rodzina">Rodzina</option>
          <option value="Znajomi">Znajomi</option>
          <option value="Praca">Praca</option>
          <option value="Inne">Inne</option>
        </select>
      </div>
      <div class="updt-comm-cont">
        <div class="updt-comm-txt">Aktualizować kontakt ?</div>
        <div class="updt-but updt-comm-confirm">TAK</div>
        <div class="updt-but updt-comm-cancel">NIE</div>
        <div class="row alerts-update"></div>
      </div>

      </div>
    `
  // kontener kontaktu - dodaj nowy element z inputami
  $(el).parent('.remove-contact').parent('.single-result-cont').append(elInputs);


  // eventy
  // klik w nie - aktualizacja
  $('.updt-comm-cancel').on('click', function(){
    cancel_updating();
  });

  // wpisywanie w formularzu - aktualizacja
  $('#nm-upd, #lnm-upd').on({
    keyup: function () {
      input_key_up_validation(this)
    }
  });

  // wpisywanie w formularzu telefon - aktualizacja
  $('#ph-upd').on({
    keyup: function () {
      input_key_up_validation(this, 'rev');
    }
  });

  // klikniecie w tak - aktualizacja
  $('.updt-comm-confirm').on('click', function(){
    
    if (validation_inp_update() === false) {
      return;
    } else {
      update_one_dev( this );
    }
    // update_one_dev(this);
  });
} // funkcja dodająca inputy do kontaktu celem aktualizacji danych

//funkcje pomocnicze dla updating inputs
function cancel_updating(){
  $('.single-result-cont').find('.updating-inputs-cont').remove();
}





export {
  checkListLength,
  clear_inputs,
  minimize,
  communicat,
  communicat_finised,
  alerts,
  alerts_off,
  validation_inp,
  input_key_up_validation,
  info_inputs,
  change_active_sort_name,
  change_kind_sorting,
  copy_txt,
  empty_base,
  active_menu,
  serach_items_on_list,
  delete_base,
  delete_many_contacts,
  add_inputs_to_udating_data,
  cancel_updating
};