const phoneMask = () => {

    const names = document.querySelectorAll('.nameMask')
    const phones = document.querySelectorAll('.phoneMask')

    if (phones.length > 0) {
        for (let i = 0; i < phones.length; i++) {
            let phone = phones[i]
            phone.addEventListener('input', () => {

                phone.value = phone.value
                    .replace(/\D/g, '')
                    .replace(/^(\d{1})/, '+$1')
                    .replace(/^(\+\d{1})(\d)/, '$1 ($2')
                    .replace(/(\(\d{3})(\d)/, '$1) $2')
                    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                    .replace(/(\d{3})(-\d{2})(\d{1,2})/, '$1-$2-$3')
                    .replace(/(-\d{2})\d+?$/, '$1')
              
            
             }
            )
        }
    }

    if (names.length > 0) {
        for (let i = 0; i < names.length; i++) {
            let name = names[i]
            name.addEventListener('input', () => {
                name.value = name.value.replace(/\d/, '')
                const capitalized = name.value.slice(0,1).toUpperCase()
                const restName = name.value.slice(1,)
                name.value = `${capitalized}${restName}`
            })
        }

    }

}

export default phoneMask

/*

                phone.value = phone.value.replace(/\D+/gi, '')

                const tel = phone.value.match(/\d{1,11}/g) 

                phone.value = phone.value.replace(/\d+/g, tel) 

                let mask = ''

                if (tel) {
                    const num = tel[0]
                    const operator = num[1]+num[2]+num[3]
                    const part1 = num[4]+num[5]+num[6]
                    const part2 = num[7]+num[8]
                    const part3 =  num[9]+num[10]
                    mask = `+7 (${operator}) ${part1}-${part2}-${part3}`
                }

                if (tel) phone.value = mask1
*/

/**

phone.value = phone.value.replace(/\D+/gi, '')

 */

/*

function phoneMask (phone) {
  return phone.replace(/\D/g, '')
    .replace(/^(\d)/, '($1')
    .replace(/^(\(\d{2})(\d)/, '$1) $2')
    .replace(/(\d{4})(\d{1,5})/, '$1-$2')
    .replace(/(-\d{5})\d+?$/, '$1');
}

*/