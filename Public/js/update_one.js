import {
    communicat,
    communicat_finised,
    cancel_updating,
  } from "../js/ovr-fun.js";


// funkcja aktualizuj jeden kontakt
function update_one_dev( el ){
    return Promise.resolve( update_one(el) )
}
function update_one(el) {
    // pobranie wartosci z aktualizowanego kontaktu, ustalenie aktualnych elementow
    let id = $(el).parent().parent().parent().attr('id');
    let imie = $("input[name=name-upd]").val().trim();
    let nazwisko = $("input[name=lastname-upd]").val().trim();
    let telefon = $("input[name=phone-upd]").val().trim();
    let grupa = $("select[name=group-upd]").val().trim();
    let arr = [ imie, nazwisko, telefon, grupa ];
    let curTxt = $(el).parent().parent().parent().find('.data-txt');
    communicat("on", "Aktualizuje kontakt");
    // zapytanie do serwera
    $.ajax({
      url: "/uo",
      contentType: "application/json",
      dataType: "json",
      processData: false,
      data: JSON.stringify({
        ID: id,
        Imie: imie.charAt(0).toUpperCase() + imie.slice(1).toLowerCase(),
        Nazwisko: nazwisko.charAt(0).toUpperCase() + nazwisko.slice(1).toLowerCase(),
        Telefon: telefon.charAt(0).toUpperCase() + telefon.slice(1).toLowerCase(),
        Grupa: grupa.charAt(0).toUpperCase() + grupa.slice(1).toLowerCase(),
      }),
      type: "POST",
      success: async function (data) {
        try {
          const updateOneOnList = await update_one_db_dev(arr, curTxt);
          cancel_updating();
          communicat_finised(data.info);
        } catch (e) {
          communicat_finised(`Błąd podczas aktualizowania kontaktu. Sprawdź konsole.`);
          cancel_updating();
          console.log(e);
        }
      }
    });
}
// funkcja po odpowiedzi serwera - aktualizacja jednego kontaktu, zmiana tekstu, stylowanie kontaktu, modyfikacja dokumentu
function update_one_db_dev(arr, curTxt) {
  return Promise.resolve(update_one_db(arr, curTxt))
}
function update_one_db(arr, curTxt) {
    $.each(arr, function(i, k){
        let a = curTxt[i];
        $(a).text(k);
        if(k == 'Rodzina' || k == 'Znajomi' || k == 'Inne' || k == 'Praca'){
            $(curTxt[0]).parent().parent().parent().find('.gr-img').attr({'title': `Grupa: ${k}`, 'src': `./img/${k.toLowerCase()}.png`})
        }
    });
}



export {
  update_one_dev
};