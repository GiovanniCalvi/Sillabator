
function id(str) {
    return document.getElementById(str);
}
const text = id("text");
const response = id("response");

//const daunoasettenumeriminoridi10 = /([0-9]{1,7}$)|([aeiou]{2})/;

const ripVocale = /[aeiouàèéìòù]{2,}/;
const trittongo = /([iu]{2,}[aeoàòéè])|([iu][aeoàòéè][iu])|([aeoàòéè][iu]{2,})/;
const dittongo = /(([aeiouàéìòù])([iu]))|(([iu])([aeiouàéìòù]))/;  // Regular Expression
const vocale  = /[aeiouàèéìòù]/;
const consonante = /([^aeiouàéìòù])/;
const ripConsonante = /([^aeiouàèéìòù]){3,}/;
const daNonDividere = /^(([bcdfgptv])([lr]))|(s([^aeiouàéìòù]))/;
const vocaleConsonante = /^([aeiouàèéìòù])([^aeiouàèéìòù])([aeiouàèéìòù])/;
const consonanteVocale = /^([^aeiouàèéìòù])([aeiouàèéìòù])/;
const vocaliAccentate = /([aeiouàèéìòù])([úíìù])|([ìùúí])([aeiouàèéìòù])/;
const daSeparare = /^(cq|cn|lm|rc|bd|mb|mn|ld|ng|nd|tm)/ ;
const prefissi = /^(di|eu|ri|bi)/;
const aeo = /[aeoàòéè]{2,}/;


response.classList.add("empty");

function isNumber(word) {
    return !Number.isNaN(parseFloat(word));
}

function sillabator (word, res, start) {
    if ( (start && word.length < 3) || isNumber(word)) {
        return word;
    }
    /*let x = false || true;
    let y = "ciccio" || "alberto"*/
    res = res || []; //idioma js
    let indiceRipetizione, indiceDivisione, pre;
    const indiceProssimaVocale = word.search(vocale);
    const indiceDittongo = word.search(dittongo);

    if (vocaleConsonante.test(word) || (vocale.test(word[0]) && daNonDividere.test(word.substr(1)))) {
        res.push(word[0]);
        word = word.substr(1);
    } else
    if (ripVocale.test(word) && indiceDittongo < 2) {
        if (vocaliAccentate.test(word) || ((pre = word.search(prefissi)) > -1  && start) || (indiceDittongo < 0 && aeo.test(word)) ) {
            indiceDivisione = pre > -1 ? pre + 2 : word.search(vocale) + 1;
            res.push(word.substr(0, indiceDivisione));
            word = word.substr(indiceDivisione);
        } 
        else if (indiceDittongo > -1) {
            const substr = word.substr(1);
            let i = trittongo.test(word) || trittongo.test(substr) ? 1 : 0;
            if (aeo.test(word[0]) && dittongo.test(substr) ){ // a-iuo-la
                res.push(word[0]);
                res.push(word.substr(1, i+2));
            } else {
               res.push(word.substr(0, i+3)); 
            }
            word = word.substr(i+3);
        
        }

    } 
    else if (daNonDividere.test(word)) {
        indiceDivisione = word.search(vocale);
        indiceDivisione += indiceDivisione == word.length -1 ? 1 : word.substr(indiceDivisione).search(consonante); // Prossima consonante
        indiceDivisione = indiceDittongo > -1 && indiceDivisione > indiceDittongo ? indiceDittongo +1 : indiceDivisione; // se dopo c'è dittongo splitta prima
        res.push(word.substr(0, indiceDivisione));
        if (indiceDivisione > -1) {
            word = word.substr(indiceDivisione);
        }
     } 
     else if (consonanteVocale.test(word) || (vocale.test(word[3]) || daNonDividere.test(word.substr(2)))) {
        pre = /^([^aeiouàéìòù])([^aeiouàéìòù])/.test(word.substr(2)) ? 1 : 0;
        res.push(word.substr(0, pre + 2));
        word = word.substr(pre + 2);
    } 
    else if ((indiceRipetizione = word.search(ripConsonante))> -1) {
        res.push(word.substr(0, indiceRipetizione+1));
        word = word.substr(indiceRipetizione +1);
    } 
    else if (word[indiceProssimaVocale+1] == word[indiceProssimaVocale+2] || daSeparare.test(word.substr(indiceProssimaVocale+1))) {
        res.push(word.substr(0, indiceProssimaVocale+2));
        word = word.substr(indiceProssimaVocale+2);
    }


    return word.length < 1 ? res.join("-") : sillabator(word, res);
}

text.oninput = function() {
    response.classList.remove("empty", "advice");
    if (text.value.length <1) {
        response.classList.add("empty");
        response.innerHTML= "";
    } else if (isNumber(text.value)) {
        response.innerHTML = "Scrivi una parola o una frase non un numero! :P";
        response.classList.add("advice");
    } else if (text.value.length < 3) {
        response.innerHTML = "Scrivi una parola più lunga magari! :P";
        response.classList.add("advice");
    }
    else  {
        const words = text.value.trim().toLowerCase().split(" "),
        res = words.map(function(word) {
            return sillabator(word, null, true);
        }).join(" ");

        if (res.length) {
            response.innerHTML = res;
        }
    }    
}