const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Данные о костях с переводом и описанием
const bonesData = [
  { id: 1, english: "Skull", russian: "Череп", description: "Костная структура головы" },
  { id: 2, english: "Mandible", russian: "Нижняя челюсть", description: "Нижняя челюстная кость" },
  { id: 3, english: "Clavicle", russian: "Ключица", description: "Кость соединяющая грудину с лопаткой" },
  { id: 4, english: "Scapula", russian: "Лопатка", description: "Кость плечевого пояса" },
  { id: 5, english: "Sternum", russian: "Грудина", description: "Центральная кость грудной клетки" },
  { id: 6, english: "Ribs", russian: "Ребра", description: "Кости грудной клетки" },
  { id: 7, english: "Humerus", russian: "Плечевая кость", description: "Кость верхней части руки" },
  { id: 8, english: "Radius", russian: "Лучевая кость", description: "Одна из костей предплечья" },
  { id: 9, english: "Ulna", russian: "Локтевая кость", description: "Вторая кость предплечья" },
  { id: 10, english: "Carpals", russian: "Кости запястья", description: "Мелкие кости запястья" },
  { id: 11, english: "Metacarpals", russian: "Пястные кости", description: "Кости ладони" },
  { id: 12, english: "Phalanges", russian: "Фаланги", description: "Кости пальцев" },
  { id: 13, english: "Pelvis", russian: "Таз", description: "Тазовые кости" },
  { id: 14, english: "Femur", russian: "Бедренная кость", description: "Самая длинная кость тела" },
  { id: 15, english: "Patella", russian: "Надколенник", description: "Коленная чашечка" },
  { id: 16, english: "Tibia", russian: "Большеберцовая кость", description: "Основная кость голени" },
  { id: 17, english: "Fibula", russian: "Малоберцовая кость", description: "Меньшая кость голени" },
  { id: 18, english: "Tarsals", russian: "Кости предплюсны", description: "Кости задней части стопы" },
  { id: 19, english: "Metatarsals", russian: "Плюсневые кости", description: "Кости средней части стопы" },
  { id: 20, english: "Vertebrae", russian: "Позвонки", description: "Кости позвоночника" }
];

// Маршруты
app.get('/api/bones', (req, res) => {
  res.json(bonesData);
});

app.get('/api/quiz', (req, res) => {
  // Перемешиваем кости для викторины
  const shuffled = [...bonesData].sort(() => Math.random() - 0.5);
  res.json(shuffled);
});

app.post('/api/check-answer', (req, res) => {
  const { boneId, answer } = req.body;
  const bone = bonesData.find(b => b.id === boneId);
  
  if (!bone) {
    return res.status(404).json({ error: 'Bone not found' });
  }
  
  const isCorrect = bone.english.toLowerCase() === answer.toLowerCase().trim();
  res.json({ isCorrect, correctAnswer: bone.english });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});