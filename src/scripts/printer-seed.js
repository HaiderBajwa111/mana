import { PrismaClient, PrinterType } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const data = [
    {
      name: 'Prusa Research',
      models: [
        { name: 'Prusa MK4', buildVolume: '250 × 210 × 220', type: PrinterType.FDM },
        { name: 'Prusa MINI+', buildVolume: '180 × 180 × 180', type: PrinterType.FDM },
        { name: 'Prusa XL', buildVolume: '360 × 360 × 360', type: PrinterType.FDM },
        { name: 'Prusa SL1S', buildVolume: '127 × 80 × 150', type: PrinterType.SLA },
      ],
    },
    {
      name: 'Bambu Lab',
      models: [
        { name: 'X1-Carbon', buildVolume: '256 × 256 × 256', type: PrinterType.FDM },
        { name: 'P1S', buildVolume: '256 × 256 × 256', type: PrinterType.FDM },
        { name: 'A1', buildVolume: '256 × 256 × 256', type: PrinterType.FDM },
        { name: 'A1 Mini', buildVolume: '180 × 180 × 180', type: PrinterType.FDM },
      ],
    },
    {
      name: 'Creality',
      models: [
        { name: 'Ender 3 V3 KE', buildVolume: '220 × 220 × 240', type: PrinterType.FDM },
        { name: 'Ender 3 S1 Pro', buildVolume: '220 × 220 × 270', type: PrinterType.FDM },
        { name: 'K1 Max', buildVolume: '300 × 300 × 300', type: PrinterType.FDM },
        { name: 'CR-M4', buildVolume: '450 × 450 × 470', type: PrinterType.FDM },
        { name: 'CR-10 Smart Pro', buildVolume: '300 × 300 × 400', type: PrinterType.FDM },
      ],
    },
    {
      name: 'Anycubic',
      models: [
        { name: 'Kobra 2 Max', buildVolume: '420 × 420 × 500', type: PrinterType.FDM },
        { name: 'Kobra Neo', buildVolume: '220 × 220 × 250', type: PrinterType.FDM },
        { name: 'Photon Mono M5s', buildVolume: '218 × 123 × 200', type: PrinterType.SLA },
        { name: 'Photon Mono X 6K', buildVolume: '197 × 122 × 245', type: PrinterType.SLA },
        { name: 'Photon Mono 2', buildVolume: '143 × 89 × 165', type: PrinterType.SLA },
      ],
    },
    {
      name: 'Elegoo',
      models: [
        { name: 'Mars 4 Ultra', buildVolume: '153 × 77 × 165', type: PrinterType.SLA },
        { name: 'Saturn 3 Ultra', buildVolume: '218 × 123 × 260', type: PrinterType.SLA },
        { name: 'Jupiter SE', buildVolume: '277 × 156 × 300', type: PrinterType.SLA },
        { name: 'Neptune 4 Max', buildVolume: '420 × 420 × 480', type: PrinterType.FDM },
        { name: 'Neptune 4 Pro', buildVolume: '225 × 225 × 265', type: PrinterType.FDM },
      ],
    },
    {
      name: 'Raise3D',
      models: [
        { name: 'Pro3', buildVolume: '300 × 300 × 300', type: PrinterType.FDM },
        { name: 'Pro3 Plus', buildVolume: '300 × 300 × 605', type: PrinterType.FDM },
        { name: 'E2', buildVolume: '330 × 240 × 240', type: PrinterType.FDM },
        { name: 'E2CF', buildVolume: '330 × 240 × 240', type: PrinterType.FDM },
      ],
    },
    {
      name: 'Formlabs',
      models: [
        { name: 'Form 3+', buildVolume: '145 × 145 × 185', type: PrinterType.SLA },
        { name: 'Form 3B+', buildVolume: '145 × 145 × 185', type: PrinterType.SLA },
        { name: 'Form 4', buildVolume: '200 × 125 × 210', type: PrinterType.SLA },
        { name: 'Form 4B', buildVolume: '200 × 125 × 210', type: PrinterType.SLA },
      ],
    },
    {
      name: 'Flashforge',
      models: [
        { name: 'Creator 4', buildVolume: '400 × 350 × 500', type: PrinterType.FDM },
        { name: 'Guider 2S', buildVolume: '280 × 250 × 300', type: PrinterType.FDM },
        { name: 'Adventurer 4 Pro', buildVolume: '220 × 200 × 250', type: PrinterType.FDM },
        { name: 'Foto 13.3', buildVolume: '292 × 165 × 400', type: PrinterType.SLA },
      ],
    },
    {
      name: 'Phrozen',
      models: [
        { name: 'Sonic Mega 8K S', buildVolume: '330 × 185 × 400', type: PrinterType.SLA },
        { name: 'Sonic Mighty 8K', buildVolume: '218 × 123 × 235', type: PrinterType.SLA },
        { name: 'Sonic Mini 8K S', buildVolume: '165 × 72 × 180', type: PrinterType.SLA },
      ],
    },
    {
      name: 'Voron',
      models: [
        { name: 'Voron 2.4', buildVolume: '350 × 350 × 350', type: PrinterType.FDM },
        { name: 'Voron Trident', buildVolume: '300 × 300 × 250', type: PrinterType.FDM },
        { name: 'Voron Switchwire', buildVolume: '250 × 210 × 210', type: PrinterType.FDM },
      ],
    },
  ]

  for (const brand of data) {
    console.log(`Processing brand: ${brand.name}`)
    
    // Use upsert to handle existing brands
    const createdBrand = await prisma.brand.upsert({
      where: { name: brand.name },
      update: {
        models: {
          create: brand.models,
        },
      },
      create: {
        name: brand.name,
        models: {
          create: brand.models,
        },
      },
    })

    console.log(`✅ Brand "${brand.name}" processed successfully`)
  }
}

main()
  .then(() => {
    console.log('✅ Seeding completed.')
    return prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    return prisma.$disconnect()
  })