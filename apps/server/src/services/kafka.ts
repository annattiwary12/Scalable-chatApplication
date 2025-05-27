import { PrismaClient } from '@prisma/client';
import { Kafka, Producer, Partitioners } from 'kafkajs';
import fs from 'fs';
import path from 'path';

// Prisma instance
const prisma = new PrismaClient();

// Load the SSL certificate
const sslCa = [fs.readFileSync(path.resolve("./ca (1).pem"), 'utf-8')];



// Kafka setup
const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER!],
  ssl: {
    ca: sslCa,
  },
  sasl: {
    mechanism: 'plain',
    username:  process.env.KAFKA_USERNAME!,
    password:  process.env.KAFKA_PASSWORD!,
  },
  createPartitioner: Partitioners.LegacyPartitioner,
} as any);

let producer: Producer | null = null;

export async function createProducer(): Promise<Producer> {
  if (producer) return producer;

  producer = kafka.producer();
  await producer.connect();
  return producer;
}

export async function produceMessage(message: string): Promise<boolean> {
  const producer = await createProducer();
  await producer.send({
    topic: 'messages',
    messages: [
      {
        key: `message-${Date.now()}`,
        value: message,
      },
    ],
  });
  return true;
}

export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: 'messages', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message, pause }) => {
      console.log(` New message received from Kafka`);

      try {
        await prisma.message.create({
          data: {
            text: message.value?.toString() || '',
          },
        });
        console.log(" Message saved to DB");
      } catch (err) {
        console.error(' Failed to save message to DB:', err);

        // Optional pause-resume logic
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: 'messages' }]);
        }, 60 * 1000);
      }
    },
  });
}

export default kafka;
