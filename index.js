const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
});

let listData = {}; // Object buat nyimpen list sementara

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Bot siap!");
});

client.on("message", (message) => {
  const chatId = message.from;
  const messageBody = message.body;

  if (messageBody.startsWith("/list-command")) {
    client.sendMessage(
      chatId,
      `\`/list-start [list name]\`: Memulai list\n
      \`/list-item [list item]\`: Menambahkan item list\n
      \`/list-check\`: Melihat list yg ada sekarang\n
      \`/list-end\`: Mengakhiri list dan menampilkan
      `
    );
  }

  // Mulai list baru dengan perintah /start-list [judul list]
  if (messageBody.startsWith("/list-start")) {
    const title = messageBody.split(" ").splice(1).join(" ");
    listData[chatId] = { title, items: [] };
    client.sendMessage(
      chatId,
      `List *${title}* dimulai! Kirim item dengan format \`/list [item].\`. untuk command lainnya, ketik: \`/list-command\``
    );
  }

  // Tambahkan item ke list dengan perintah /list [item]
  if (messageBody.startsWith("/list-item") && listData[chatId]) {
    console.log(listData);
    console.log(messageBody);

    const listItem = messageBody.split(" ").splice(1).join(" ");
    const itemIsExist = listData[chatId].items.find(
      (item) =>
        item.toString().toLowerCase() === listItem.toString().toLowerCase()
    );
    if (itemIsExist) {
      return client.sendMessage(
        chatId,
        `List *${item}* sudah ada dalam list ${listData[chatId].title}`
      );
    }

    listData[chatId].items.push(item);
  }

  // Cek isi list dengan perintah /list-check
  if (messageBody === "/list-check" && listData[chatId]) {
    const items = listData[chatId].items
      .map((item, index) => `${index + 1}. ${item}`)
      .join("\n");
    client.sendMessage(chatId, `List *${listData[chatId].title}*(dalam proses):\n${items}`);
  }

  // Selesaikan list dengan perintah /end-list
  if (messageBody === "/list-end" && listData[chatId]) {
    const items = listData[chatId].items
      .map((item, index) => `${index + 1}. ${item}`)
      .join("\n");
    client.sendMessage(
      chatId,
      `List *${listData[chatId].title}* :\n${items}`
    );
    delete listData[chatId]; // Hapus list setelah selesai
  }
});

client.initialize();
