const b58Alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

var BASE_MAP = new Uint8Array(256)
for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255
}
for (var i = 0; i < b58Alphabet.length; i++) {
    var x = b58Alphabet.charAt(i)
    var xc = x.charCodeAt(0)
    if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }
    BASE_MAP[xc] = i
}
var BASE = b58Alphabet.length
var LEADER = b58Alphabet.charAt(0)
var FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
var iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up

function encode(source) {
    if (source instanceof Uint8Array) {
    } else if (ArrayBuffer.isView(source)) {
        source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength)
    } else if (Array.isArray(source)) {
        source = Uint8Array.from(source)
    }
    if (!(source instanceof Uint8Array)) { throw new TypeError('Expected Uint8Array') }
    if (source.length === 0) { return '' }
    // Skip & count leading zeroes.
    var zeroes = 0
    var length = 0
    var pbegin = 0
    var pend = source.length
    while (pbegin !== pend && source[pbegin] === 0) {
        pbegin++
        zeroes++
    }
    // Allocate enough space in big-endian base58 representation.
    var size = ((pend - pbegin) * iFACTOR + 1) >>> 0
    var b58 = new Uint8Array(size)
    // Process the bytes.
    while (pbegin !== pend) {
        var carry = source[pbegin]
        // Apply "b58 = b58 * 256 + ch".
        var i = 0
        for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
            carry += (256 * b58[it1]) >>> 0
            b58[it1] = (carry % BASE) >>> 0
            carry = (carry / BASE) >>> 0
        }
        if (carry !== 0) { throw new Error('Non-zero carry') }
        length = i
        pbegin++
    }
    // Skip leading zeroes in base58 result.
    var it2 = size - length
    while (it2 !== size && b58[it2] === 0) {
        it2++
    }
    // Translate the result into a string.
    var str = LEADER.repeat(zeroes)
    for (; it2 < size; ++it2) { str += b58Alphabet.charAt(b58[it2]) }
    return str
}
function decodeUnsafe(source) {
    if (typeof source !== 'string') { throw new TypeError('Expected String') }
    if (source.length === 0) { return new Uint8Array() }
    var psz = 0
    // Skip and count leading '1's.
    var zeroes = 0
    var length = 0
    while (source[psz] === LEADER) {
        zeroes++
        psz++
    }
    // Allocate enough space in big-endian base256 representation.
    var size = (((source.length - psz) * FACTOR) + 1) >>> 0 // log(58) / log(256), rounded up.
    var b256 = new Uint8Array(size)
    // Process the characters.
    while (source[psz]) {
        // Decode character
        var carry = BASE_MAP[source.charCodeAt(psz)]
        // Invalid character
        if (carry === 255) { return }
        var i = 0
        for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
            carry += (BASE * b256[it3]) >>> 0
            b256[it3] = (carry % 256) >>> 0
            carry = (carry / 256) >>> 0
        }
        if (carry !== 0) { throw new Error('Non-zero carry') }
        length = i
        psz++
    }
    // Skip leading zeroes in b256.
    var it4 = size - length
    while (it4 !== size && b256[it4] === 0) {
        it4++
    }
    var vch = new Uint8Array(zeroes + (size - it4))
    var j = zeroes
    while (it4 !== size) {
        vch[j++] = b256[it4++]
    }
    return vch
}

function decode(string) {
    var buffer = decodeUnsafe(string)
    if (buffer) { return buffer }
    throw new Error('Non-base' + BASE + ' character')
}

const address_0x = "0x"+new TextDecoder('utf-8').decode(decode("3kJ1VQBGdr8kuyvavdYNf5BpNajNJT7aD7CH4BrWfta4rcy7RvHdHYq"))
console.log(address_0x)

const address_41 = "41"+encode(Buffer.from("7F1F296D0cb5C5e21D8435029718BaF0FBa02796"))
console.log(address_41)