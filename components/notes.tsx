import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const supabaseUrl = "NEXT_PUBLIC_SUPABASE_URL";
const supabaseKey = "NEXT_PUBLIC_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const prisma = new PrismaClient();

async function transferData() {
  // Supabase'den veriyi çekin
  const { data, error } = await supabase.from("Notes").select("*");

  if (error) {
    console.error("Error fetching data from Supabase:", error);
    return;
  }

  // Veriyi Prisma'ya ekleyin
  for (const note of data) {
    await prisma.notes.create({
      data: {
        id: note.id,
        title: note.title,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  }

  console.log("Data transferred successfully!");
}

transferData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
