const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// إعداد Multer لرفع الملفات
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ربط قاعدة البيانات
mongoose.connect('mongodb+srv://ikbal123:<6313381a>@cluster0.buscx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
});

const makoaaSchema = new mongoose.Schema({
  name: String,
  proof: String, // حفظ الصورة كـ Base64
});

const Makoaa = mongoose.model('Makoaa', makoaaSchema);

app.use(cors());
app.use(express.json());

// إضافة مكوع جديد
app.post('/add', upload.single('proof'), async (req, res) => {
  try {
    const { name } = req.body;
    const proof = req.file.buffer.toString('base64');

    const newMakoaa = new Makoaa({ name, proof });
    await newMakoaa.save();

    res.json({ success: true, message: 'تم إضافة المكوع بنجاح.' });
  } catch (err) {
    res.json({ success: false, message: 'حدث خطأ أثناء الإضافة.' });
  }
});

// البحث عن مكوع
app.get('/search', async (req, res) => {
  const { name } = req.query;
  const makoaa = await Makoaa.findOne({ name });

  if (makoaa) {
    res.json({ success: true, data: makoaa });
  } else {
    res.json({ success: false, message: 'لم يتم العثور على المكوع.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
