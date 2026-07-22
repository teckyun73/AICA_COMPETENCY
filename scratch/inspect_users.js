const decrypt = (cipherText) => {
  const shifted = cipherText.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join('');
  return decodeURIComponent(escape(atob(shifted)));
};

const encrypt = (plainText) => {
  const b64 = btoa(unescape(encodeURIComponent(plainText)));
  return b64.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 3)).join('');
};

const rawEncryptedUsers = [
  { id: "admin1", name: ":M5397.]:Mt3", email: "]Kgv]ZYD\\[Uo\\5QxOpw|" },
  { id: "admin2", name: ":Mtz:OF<:]5X", email: "\\5k6gXEkgJYm\\57xd6L@" },
  { id: "rev1", name: ":M53:M9v:M|n", email: "dqov]ZXzQHEkgJYmOpw|" },
  { id: "rev2", name: ":Lxj:NNI:OFv", email: "dpQ}dJoxTJI3]ZQwe5MseJo3hV8me53@" },
  { id: "rev3", name: ":M53:LRE:MlE", email: "f6ov]ZXzPXEkgJYmf6o}gJYwOpw|" },
  { id: "rev4", name: ":Mln:M57:]p\\", email: "dZ8rg5IxQWYDepI5][Lx\\5<w" },
  { id: "rev5", name: "9:F{:M9v:Lt8", email: "dqQz\\ZYuTJI3]ZQwe5MseJo3hV8me53@" },
  { id: "rev6", name: "9upD:MlE", email: "hZ<4epgD\\[Uo\\6Q8f6UoeV8ufj@@" },
  { id: "rev7", name: ":M53:\\Rf:]xL", email: "eJYogJIodJ<yenEkgJYmOpw|" },
  { id: "rev8", name: ":M53:OFv:MlE", email: "\\6oieJYoTJI3]ZQwe5MseJo3hV8me53@" },
  { id: "rev9", name: ":LVf99.;9uhf", email: "eZw}]Z<D\\[Uo\\6Q8f6UoeV8ufj@@" },
  { id: "rev10", name: "9upD9:R3989P", email: "9upD9:R3989P" },
  { id: "rev11", name: ":OZf9:VM:M9v", email: "\\psmdJ<sTJI3]ZQme54zg[Uofl8ufj@@" },
  { id: "rev12", name: ":M9o:LV{:]xL", email: "f5kt\\Z8qPGID\\[Uo\\5Qye[E4gJY|Opw|" }
];

console.log("--- Current Decrypted Users ---");
rawEncryptedUsers.forEach(u => {
  console.log(`${u.id}: Name='${decrypt(u.name)}', Email='${decrypt(u.email)}'`);
});

const newEmail = "inhwan@atec.kr";
const encNewEmail = encrypt(newEmail);
console.log(`\nEncrypted '${newEmail}': '${encNewEmail}'`);
console.log(`Verification Decrypt: '${decrypt(encNewEmail)}'`);
