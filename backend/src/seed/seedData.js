import { connectDB } from '../config/db.js';
import { Course, MCQ, Module, Subject, TaskType, Topic } from '../models/index.js';

const coursesInput = [
  { title: '1st Course', subjects: ['Entering to the profession','Histology, cytology and embriology','Religious studies','The latest history of Uzbekistan. Bioethics','Human Anatomy','Information technologies in medicine','Medical and biological physics','Medical biology with elements of ecology','Medical chemistry','Medical English','Medical latin terminology','Microbiology, Virology, Parasitology and Immunology','New medical technology and medical equipments','Pharmacology','Physiology','Russian language for the students of medical institute','Uzbek language'] },
  { title: '2nd Course', subjects: ['Biochemistry','Clinic anatomy','Clinical laboratory diagnostics','First Aid','Histology, Cytology and Embryology','Human Anatomy','Medical genetics','Microbiology, Virology, Parasitology and Immunology','Molecular physiology, Pathophysiology','Pathological physiology','Pathological Anatomy','Pediatrics propedeutics','Pharmacology','Philosophy','Physiology','Propedeutics of internal disease','Psychology and pedagogy','Medical Deontology. Doctor-Patient Communication'] },
  { title: '3rd Course', subjects: ['Clinical laboratory diagnostics','Dietology. Nutritionology.','Folk medicine','General surgery','Hematology','Hygiene. Medical Ecology','Internal medicine','Medical genetics','Medical radiology','Molecular Physiology, pathophysiology','Obstetrics and gynecology','Pathological physiology','Pathological Anatomy','Pediatrics','Pharmacology','Propaedeutics of childhood diseases','Propedeutics of internal disease','Rehabilitology, sport medicine','Neuroradiology'] },
  { title: '4th Course', subjects: ["Children's surgery",'Clinic Pharmacology','Clinical allergology and immunology','Dermatovenerology','Endocrinology','Forensic medicine','Internal medicine','Medical psychology','Neurology','Neurosurgery','Obstetrics and gynecology','Occupational diseases','Oncology','Otorhinolaryngology','Pediatrics','Phthisiology','Public health','Scientific research methods and biostatistics','Surgery','Traumatology and Orthopedics','Urology','Dentistry','Partially removable dentures'] },
  { title: '5th Course', subjects: ['Anesthesiology and resuscitation','Clinic Pharmacology','Clinical allergology and immunology','Emergency medicine','Epidemiology',"Infectious diseases. Children's infectious diseases",'Internal medicine','Neonatolgy','Neurology','Neurosurgery','Obstetrics and gynecology','Occupational diseases','Oncology','Ophthalmology','Otorhinolaryngology','Phthisiology','Psychiatry, Narcology','Surgery','Dentistry','Fully removable prosthesis','Periodontology','Traumatology and Orthopedics','Surgery in familial medicine','Fundamental endoscopic surgery'] },
  { title: '6th Course', subjects: ['Emergency medicine','Infectious diseases','Therapy in family medicine','Therapy in family medicine (subordinature)','Obstetrics and gynecology','Obstetrics and gynecology in familial medicine','Obstetrics and gynecology in familial medicine (Subordinature)','Pediatrics in familial medicine (Subordinature)','Pediatrics in familial medicine- MD (11-semester)','Rheumatology','Surgery in familial medicine (Subordinature)','Surgery in familial medicine','Simulation study','Tropical diseases'] }
];

function topicNames() {
  return Array.from({ length: 15 }).map((_, i) => `Topic ${i + 1}`);
}

async function seed() {
  await connectDB();
  await Promise.all([Course.deleteMany({}), Subject.deleteMany({}), Module.deleteMany({}), Topic.deleteMany({}), TaskType.deleteMany({}), MCQ.deleteMany({})]);

  for (const c of coursesInput) {
    const course = await Course.create({ title: c.title });
    for (const s of c.subjects) {
      const subject = await Subject.create({ course_id: course._id, title: s });
      for (const moduleTitle of ['Module 1', 'Module 2']) {
        const module = await Module.create({ subject_id: subject._id, title: moduleTitle });
        for (const t of topicNames()) {
          const topic = await Topic.create({ module_id: module._id, title: t });
          const taskTypes = await TaskType.insertMany([
            { topic_id: topic._id, type: 'task_question' },
            { topic_id: topic._id, type: 'situational_task' }
          ]);
          for (const taskType of taskTypes) {
            await MCQ.create({
              task_type_id: taskType._id,
              question: `${subject.title} - ${module.title} - ${t}: Sample MCQ`,
              option_a: 'Option A', option_b: 'Option B', option_c: 'Option C', option_d: 'Option D',
              correct_option: 'A',
              explanation: 'Option A best matches the tested concept and exam objective.',
              published: true
            });
          }
        }
      }
    }
  }
  console.log('Seed complete for 6-course hierarchy.');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
