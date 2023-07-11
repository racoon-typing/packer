// Объект с данными
let Box = {
    product: {
        number: 0,
        length: 0,
        width: 0,
        height: 0,
        volume: null,
    },
    medium: {
        name: 'Коробка M',
        side: {
            length: 40,
            width: 40,
            height: 40,
        },
        volume: null,
        number: {
            product: 0,
            box: 0,
        },
    },
    big: {
        name: 'Коробка L',
        side: {
            length: 60,
            width: 40,
            height: 40,
        },
        volume: null,
        number: {
            product: 0,
            box: 0,
        },
    },
    little: {
        name: 'Коробка S',
        side: {
            length: 25,
            width: 25,
            height: 15,
        },
        volume: null,
        number: {
            product: 0,
            box: 0,
        },
    },
}

// Значение 1 куб метра в куб сантиметрах
const CMINMETERS = 1000000;

// Нода Формы
const formNode = document.querySelector('.calculator__form');

// Получает объем коробок +
function getBoxVolume(box) {
    // Размеры коробок
    const bigBoxSide = box.big.side;
    const mediumBoxSide = box.medium.side;
    const littleBoxSide = box.little.side;

    // Объем большой коробки, в м^3
    const volumeBigBoxInMeters = ((bigBoxSide.height * bigBoxSide.length * bigBoxSide.width) / CMINMETERS).toFixed(3);

    // Объем средней коробки, в м^3
    const volumeMediumBoxInMeters = ((mediumBoxSide.height * mediumBoxSide.length * mediumBoxSide.width) / CMINMETERS).toFixed(3);

    // Объем маленькой коробки, в м^3
    const volumeLittleBoxInMeters = ((littleBoxSide.height * littleBoxSide.length * littleBoxSide.width) / CMINMETERS).toFixed(3);

    // Записывает в свойство объем большой коробки
    box.big.volume = volumeBigBoxInMeters;

    // Записывает в свойство объем средней коробки
    box.medium.volume = volumeMediumBoxInMeters;

    // Записывает в свойство объем маленькой коробки
    box.little.volume = volumeLittleBoxInMeters;
}

// Вычисляет кол-во товаров помещающихся в коробку
function getNumberProductInBox(big, medium, little, box) {
    const bigBoxVolume = box.big.volume; // Объем больой коробки
    const mediumBoxVolume = box.medium.volume; // Объем средней коробки
    const littleBoxVolume = box.little.volume; // Объем маленькой коробки

    big.number.product = Math.floor(bigBoxVolume / box.product.volume);
    medium.number.product = Math.floor(mediumBoxVolume / box.product.volume);
    little.number.product = Math.floor(littleBoxVolume / box.product.volume);
}

// Сортирует значения длин сторон товара
function sortSizeOfBox(product) {
    // Сортирует значения длин сторон товара
    const productLength = product.length;
    const productWidth = product.width;
    const productHeight = product.height;

    // Массив с размерами товара
    const arrOfSizes = [productLength, productWidth, productHeight];
    // Сортированный массив с размерами товара
    const sortSizes = arrOfSizes.sort((a, b) => a - b);

    // Присваивает самое маленькое значение Высоте
    product.height = sortSizes[0];
    // Присваивает 1 значение по величине Ширине
    product.width = sortSizes[1];
    // Присваивает 2 значение по величине Длине
    product.length = sortSizes[2];
}

// Рассчитывает кол-во коробок для упаковки товара
function getNumberOfBox(box) {
    // Объем большой коробки
    const bigBoxVolume = box.big.volume; 
    // Объем средней коробки
    const mediumBoxVolume = box.medium.volume; 
    // Объем маленькой коробки
    const littleBoxVolume = box.little.volume; 

    // Доступ к коробкам
    const bigBox = box.big;
    const mediumBox = box.medium;
    const littleBox = box.little;

    // Доступ к товару
    const product = box.product;

    // Объем поставки
    let productsVolume = box.product.volume * box.product.number;

    // Вычисляет кол-во товаров в коробке
    getNumberProductInBox(bigBox, mediumBox, littleBox, box);

    // Сортирует значения длин сторон товара
    sortSizeOfBox(product);

    // Проверяет помещается ли товар в коробки
    const isInsideBigBox = product.length > bigBox.side.length || product.width > bigBox.side.width || product.height > bigBox.side.height;
    const isInsideMediumBox = product.length > mediumBox.side.length || product.width > mediumBox.side.width || product.height > mediumBox.side.height;
    const isInsideLittleBox = product.length > littleBox.side.length || product.width > littleBox.side.width || product.height > littleBox.side.height;

    // Проверка помещается ли товар в одну из коробкок
    if (isInsideBigBox) {
        alert('Ваш товар не помещается в большую коробку. Проверьте введенные значения');
        return;
    } else if (isInsideMediumBox) {
        // Распределяет поставку по коробкам с учетом того, что товар не помещается в среднюю коробку
        while (productsVolume > 0) {
            bigBox.number.box += 1;
            productsVolume -= bigBoxVolume;
        }
    } else if (isInsideLittleBox) {
        // Распределяет поставку по коробкам с учетом того, что товар не помещается в маленькую коробку
        while (productsVolume > 0) {
            if (productsVolume >= bigBoxVolume) {
                bigBox.number.box += 1;
                productsVolume -= bigBoxVolume;
            } else {
                mediumBox.number.box += 1;
                productsVolume -= mediumBoxVolume;
            }
        }
    } else {
        // Распределяет поставку по коробкам
        while (productsVolume > 0) {
            if (productsVolume >= bigBoxVolume) {
                bigBox.number.box += 1;
                productsVolume -= bigBoxVolume;
            } else if (productsVolume < bigBoxVolume && productsVolume >= mediumBoxVolume) {
                mediumBox.number.box += 1;
                productsVolume -= mediumBoxVolume;
            } else if (productsVolume < mediumBoxVolume && productsVolume >= littleBoxVolume) {
                littleBox.number.box += 1;
                productsVolume -= littleBoxVolume;
            } else {
                littleBox.number.box += 1;
                productsVolume -= littleBoxVolume;
            }
        }
    }
}

// Выводит значения на страницу +
function outputBoxValue(box) {
    const { product, big, medium, little } = box;

    // Объем коробок
    const bigBoxVolume = document.querySelector('#big-box-volume');
    const mediumBoxVolume = document.querySelector('#medium-box-volume');
    const littleBoxVolume = document.querySelector('#little-box-volume');

    // Товаров в коробке
    const bigBoxProducts = document.querySelector('#big-box-products');
    const mediumBoxProducts = document.querySelector('#medium-box-products');
    const littleBoxProducts = document.querySelector('#little-box-products');

    // Кол-во коробок
    const bigBoxNumber = document.querySelector('#big-box-number');
    const mediumBoxNumber = document.querySelector('#medium-box-number');
    const littleBoxNumber = document.querySelector('#little-box-number');

    // Объем поставки
    const productVolume = document.querySelector('#product-volume');

    // Вставляет характеристики
    bigBoxVolume.textContent = big.volume;
    mediumBoxVolume.textContent = medium.volume;
    littleBoxVolume.textContent = little.volume;
    //
    bigBoxProducts.textContent = big.number.product;
    mediumBoxProducts.textContent = medium.number.product;
    littleBoxProducts.textContent = little.number.product;
    //
    productVolume.textContent = `${(product.volume * product.number).toFixed(1)}`
    //
    if (big.number.box !== '') {
        bigBoxNumber.textContent = big.number.box;
    } else {
        bigBoxNumber.textContent = 0;
    }
    if (big.number.box !== '') {
        mediumBoxNumber.textContent = medium.number.box;
    } else {
        mediumBoxNumber.textContent = 0;
    }
    if (big.number.box !== '') {
        littleBoxNumber.textContent = little.number.box;
    } else {
        littleBoxNumber.textContent = 0;
    }
}

// Очищает объект Box +
function cleanObjectBox() {
    return Box = {
        product: {
            number: 0,
            length: 0,
            width: 0,
            height: 0,
            volume: null,
        },
        medium: {
            name: 'Коробка M',
            side: {
                length: 40,
                width: 40,
                height: 40,
            },
            volume: null,
            number: {
                product: 0,
                box: 0,
            },
        },
        big: {
            name: 'Коробка L',
            side: {
                length: 60,
                width: 40,
                height: 40,
            },
            volume: null,
            number: {
                product: 0,
                box: 0,
            },
        },
        little: {
            name: 'Коробка S',
            side: {
                length: 25,
                width: 25,
                height: 15,
            },
            volume: null,
            number: {
                product: 0,
                box: 0,
            },
        },
    }
}

// Слушатель на отправку формы
formNode.addEventListener('submit', (evt) => {
    evt.preventDefault();

    // Данные из полей ввода
    const formData = new FormData(formNode);

    const productNum = Number(formData.get('number')); // Кол-во товаров, шт
    const productLength = Number(formData.get('length')); // Длина товара, см 
    const productWidth = Number(formData.get('width')); // Ширина товара, см 
    const productHeight = Number(formData.get('height')); // Высота товара, см 

    // Ничего не делать если поля не заполнены
    if (!productNum || !productLength || !productWidth || !productHeight) {
        return;
    }

    // Объем товара, в м^3
    const productVolumeInMeters = ((productLength * productWidth * productHeight) / CMINMETERS).toFixed(3);

    // Записывает значения в свойства Продукта
    Box.product.volume = productVolumeInMeters;
    Box.product.number = productNum;
    Box.product.length = productLength;
    Box.product.width = productWidth;
    Box.product.height = productHeight;

    // Объем коробок
    getBoxVolume(Box);

    // Кол-во коробок для упаковки товара
    getNumberOfBox(Box);

    // Выводит значения на страницу
    outputBoxValue(Box);

    // Очищает объект Box
    cleanObjectBox();
});