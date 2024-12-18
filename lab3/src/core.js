/**
 * Функция проверяет, является ли число целым, используя побитовые операторы
 * @param {*} n
 */
function isInteger(n) {
    return (n | 0) === n;
}

/**
 * Функция возвращает массив четных чисел от 2 до 20 включительно
 */
function even() {
    const result = [];
    for (let i = 2; i <= 20; i += 2) {
        result.push(i);
    }
    return result;
}

/**
 * Функция, считающая сумму чисел до заданного используя цикл
 * @param {*} n
 */
function sumTo(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

/**
 * Функция, считающая сумму чисел до заданного используя рекурсию
 * @param {*} n
 */
function recSumTo(n) {
    if (n === 1) return 1;
    return n + recSumTo(n - 1);
}

/**
 * Функция, считающая факториал заданного числа
 * @param {*} n
 */
function factorial(n) {
    if (n === 0) return 1;
    else return n * factorial(n - 1);
}

/**
 * Функция, которая определяет, является ли число двойкой, возведенной в степень
 * @param {*} n
 */
function isBinary(n) {
    if (n <= 0) return false;
    while (n % 2 === 0) {
        n /= 2;
    }
    return n === 1;
}

/**
 * Функция, которая находит N-е число Фибоначчи
 * @param {*} n
 */
function fibonacci(n) {
        if (n <= 1) return 1;
        let a = 1, b = 1;
        for (let i = 2; i < n; i++) {
            let temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    };

/** Функция, которая принимает начальное значение и функцию операции
 * и возвращает функцию - выполняющую эту операцию.
 * Если функция операции (operatorFn) не задана - по умолчанию всегда
 * возвращается начальное значение (initialValue)
 * @param initialValue
 * @param operatorFn - (storedValue, newValue) => {operation}
 */
function getOperationFn(initialValue, operatorFn) {
    let storedValue = initialValue;
    return function(newValue) {
        if (operatorFn) {
            storedValue = operatorFn(storedValue, newValue);
        }
        return storedValue;
    };
}

/**
 * Функция создания генератора арифметической последовательности.
 * При ее вызове, она возвращает новую функцию генератор - generator().
 * Каждый вызов функции генератора возвращает следующий элемент последовательности.
 * @param {number} start - число с которого начинается последовательность
 * @param {number} step  - число шаг последовательности
 */
function sequence(start = 0, step = 1) {
    let current = start - step;
    return function() {
        current += step;
        return current;
    };
}

/**
 * Функция deepEqual, которая принимает два значения
 * и возвращает true только в том случае, если они имеют одинаковое значение
 * или являются объектами с одинаковыми свойствами,
 * значения которых также равны при сравнении с рекурсивным вызовом deepEqual.
 *
 * @param {object} firstObject - первый объект
 * @param {object} secondObject - второй объект
 * @returns {boolean} - true если объекты равны(по содержанию) иначе false
 */
function deepEqual(firstObject, secondObject) {
    // Проверка на строгую равенство (обрабатывает примитивные значения и случаи с тем же объектом)
    if (firstObject === secondObject) {
        return true;
    }

    // Проверка на случай NaN
    if (typeof firstObject === "number" && typeof secondObject === "number" && isNaN(firstObject) && isNaN(secondObject)) {
        return true;
    }

    // Проверка на null или non-object
    if (firstObject === null || typeof firstObject !== "object" || secondObject === null || typeof secondObject !== "object") {
        return false;
    }

     // Проверка на массивы
    if (Array.isArray(firstObject) && Array.isArray(secondObject)) {
        if (firstObject.length !== secondObject.length) {
            return false;
        }
        for (let i = 0; i < firstObject.length; i++) {
            if (!deepEqual(firstObject[i], secondObject[i])) {
                return false;
            }
        }
        return true;
    }

    // Получаем ключи обоих объектов
    const keysFirst = Object.keys(firstObject);
    const keysSecond = Object.keys(secondObject);

    // Проверяем, одинаковое ли количество ключей
    if (keysFirst.length !== keysSecond.length) {
        return false;
    }

    // Проверяем каждый ключ объекта на наличие и рекурсивное равенство значений
    for (const key of keysFirst) {
        if (!keysSecond.includes(key) || !deepEqual(firstObject[key], secondObject[key])) {
            return false;
        }
    }

    return true;
}



module.exports = {
    isInteger,
    even,
    sumTo,
    recSumTo,
    factorial,
    isBinary,
    fibonacci,
    getOperationFn,
    sequence,
    deepEqual,
};
