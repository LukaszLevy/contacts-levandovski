import {
  get_all_contacts_dev
} from "../js/get_db.js";
import {
  add_one
} from "../js/add_one_db.js";
import {
  minimize,
  info_inputs,
  input_key_up_validation,
  change_active_sort_name,
  change_kind_sorting,
  active_menu,
  serach_items_on_list,
  delete_base,
  delete_many_contacts,
  communicat_finised,
  checkListLength
} from "../js/ovr-fun.js";
import {
  get_trial_dev
} from "../js/get_trial.js";
import {
  sort_by
} from "./sort_by.js";


$(document).ready(async function () {

  CONTACT_APP_ASYNC();

  // APLIKACJA 
  function CONTACT_APP_ASYNC() {
    return Promise.resolve(CONTACT_APP());
  }
  async function CONTACT_APP() {
    // pobranie bazy danych
    await get_all_contacts_dev();
    
    // klkanie w ikony menu
    $('.icn-cnt').on({
      click: function () {
        active_menu(this);
      }
    });

    // klknięcie w szukaj w bazie w menu
    $('#sch-module-icn').on({
      click: function () {
        $(`#sch`).focus();
      }
    });

    // klkinięcie w minimalizowanie w menu
    $(".minimize").on({
      click: function () {
        minimize(this);
      }
    });

    // klknięcie w dodaj w zakladce dodawanie
    $("#send").on({
      click: function () {
        // sprawdz ilosc kontaktow
        if(checkListLength(100) === false){
          communicat_finised('Przekroczono maksymalną ilośc kontaktów - usuń kontakty lub całą bazę aby móć dodać.');
          return
        }
        add_one()
      }
    });

    // kliknięcie w podowiedzi input w zakladce dodawanie
    $('.input-info').on({
      click: function () {
        info_inputs(this)
      }
    });

    // pisanie w input imie i nazwisko w zakldace dodawanie
    $('#nm, #lnm').on({
      keyup: function () {
        input_key_up_validation(this)
      }
    });

    // pisanie w input nr telefonu w zakldace dodawanie
    $('#ph').on({
      keyup: function () {
        input_key_up_validation(this, 'rev');
      }
    });


    // klikniecie w rodzaj sortowania w zakladce sortuj - asc / dsc
    $('#sort-kind').on({
      click: function () {
        change_kind_sorting(this);
      }
    })

    // klikniecie w nazwy sortowania w zakladce sortuj
    $('.sort-name').on({
      click: function () {
        change_active_sort_name(this);
      }
    })

    // klikniecie w sortuj sortowania w zakladce sortuj
    $('#sort').on({
      click: function () {
        sort_by();
      }
    })

    // klikniecie w input search w zakladce menu szukaj w bazie
    $('#sch').on({
      keyup: function () {
        serach_items_on_list(this);
      }
    });

    // klikniecie w lupe w zakladce menu szukaj w bazie
    $('.search img').on({
      click: function () {
        $(this).siblings('input').val("").attr('placeholder', 'Wyszukaj');
        serach_items_on_list($(this).siblings('input'));
      }
    })

    // klknięcie w usun cala baze w zakladce usuwanie 
    $('#del-db').on({
      click: function () {
        delete_base(this);
      }
    })

    // klknięcie w usun wiele kontaktow w zakladce usuwanie
    $('#del-few-cnt').on({
      click: function () {
        delete_many_contacts();
      }
    })

    // podwojne klkniecie w wgraj testowa baze w zakladce usuwanie u
    $('.restore-db').on('dblclick', async () => {
      if(checkListLength(100) === false){
        communicat_finised('Przekroczono maksymalną ilośc kontaktów - usuń kontakty lub całą bazę aby móć dodać.');
        return
      }
      // dogranie testowych konatktow do bazy
      const user = await get_trial_dev();
      // ponowne pobranie bazy kontaktow, aktualizacja listy kontaktow
      const books = setTimeout(async () => {
        await get_all_contacts_dev()
      }, 2000);
    });

    $('.top').on("click", function(){
      document.querySelector('html').scrollTo({
        top: 0,
        behavior: "smooth"
      })
    })


    

    
  } // CONTACT_APP
}); // document ready