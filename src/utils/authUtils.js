export const generatePassword = (length) => {
    const chars = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        number: '0123456789',
        special: '@$!%*?&',
    };
    const all = chars.upper + chars.lower + chars.number + chars.special;
    const getRandom = (set) => set[Math.floor(Math.random() * set.length)];
    const hasCriteria = (password) => 
        /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password);

    if (length < 4) throw new Error("Password length must be at least 4");

    let password;
    do {
        password = [getRandom(chars.upper), getRandom(chars.lower), getRandom(chars.number), getRandom(chars.special)]
            .concat(Array.from({ length: length - 4 }, () => getRandom(all)))
            .sort(() => Math.random() - 0.5)
            .join('');
    } while (!hasCriteria(password));

    return password;
}
