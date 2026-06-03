<!-- source: corpus/flipper-zero/raw/home.html | cleaned: 2026-06-03T22:45:52.566Z -->

Flipper Zero — Portable Multi-tool Device for Geeks

  Skip to content

         Flipper Zero

         Multi-tool Device for Geeks

            Flipper Zero is a portable multi-tool for pentesters and geeks in a toy-like body. It loves hacking digital stuff, such as radio protocols, access control systems, hardware, and more. It's fully open-source and customizable, so you can extend it in whatever way you like.

             BUY NOW

       What is Flipper Zero

               Your cyber buddy

                    Flipper Zero is a tiny piece of hardware with a curious personality of a cyber-dolphin. It can interact with digital systems in real life and grow while you use it. Explore any kind of access control system, RFID, radio protocols, and debug hardware using GPIO pins.

                    The idea of Flipper Zero is to combine all the hardware tools you'd need for exploration and development on the go. Flipper was inspired by the pwnagotchi project, but unlike other DIY boards, Flipper is designed with the convenience of everyday usage in mind — it has a robust case, handy buttons, and shape, so there are no dirty PCBs or scratchy pins. Flipper turns your projects into a game, reminding you that development should always be fun.

             1.4" monochrome LCD display 128x64 px, ultra-low power sunlight-readable
             5-button directional pad
             Back button
             Status LED

            Flipper Zero is completely autonomous and can be controlled with a 5-button directional pad without additional devices, such as computers or smartphones. Main features are available from the Main Menu.
            For more control, you can connect to Flipper Zero via USB and Bluetooth. Instead of a TFT, IPS or OLED, we decided to build in a cool old-school LCD.

             USB Type-C   Power & charging  Firmware update
             MicroSD card slot
             Lanyard loop

             GPIO pins 3.3V logic levels (5V tolerant for input)
             Infrared transceiver
             1-Wire pogo pins

       Sub-1 GHz Transceiver

         Sub-1 GHz Range

          This is the operating range for a wide class of wireless devices and access control systems, such as garage door remotes, boom barriers, IoT sensors and remote keyless systems. Users can expand their Flipper Zero capabilities by installing additional apps to read data from various devices including weather stations.  Flipper has an integrated multi-band antenna, and a CC1101 chip, making it a powerful transceiver  with a range of up to 50 meters .

             Smart sockets and bulbs

             IoT sensors and doorbells

             Garage doors and barriers

         Customizable radio platform
          CC1101 is a universal transceiver designed for very low-power wireless applications. It supports various types of digital modulations such as 2-FSK, 4-FSK, GFSK and MSK, as well as OOK and flexible ASK shaping. You can perform any digital communication in your applications such as connecting to IoT devices and access control systems.

       125 kHz RFID

         Low-frequency proximity cards

          This type of card is widely used in old access control systems around the world. It's pretty dumb, stores only an N-byte ID and has no authentication mechanism, allowing it to be read, cloned and emulated by anyone. A 125 kHz antenna is located on the bottom of Flipper Zero — it can read low-frequency proximity cards and save them to memory to emulate later.  You can also emulate cards by entering their IDs manually. Moreover, Flipper Zero owners can share card IDs remotely with other Flipper Zero users.

       NFC

         High-frequency proximity cards

          Flipper Zero has a built-in NFC module (13.56 MHz). Along with the 125 kHz RFID module, it turns Flipper Zero into an ultimate RFID device operating in both low-frequency (LF) and high-frequency (HF) ranges. The NFC module supports all the major standards.  It works pretty much the same as the 125 kHz module, allowing you to interact with NFC-enabled devices — read, write and emulate HF tags.

       Bluetooth

          Full Bluetooth Low Energy (BLE) support allows Flipper Zero to act as a peripheral device, allowing you to connect your Flipper Zero to 3rd-party devices and smartphones.  Our mobile developers have designed apps for iOS and Android that let you update your Flipper Zero via BLE, remotely control the device, share keys, and manage data on a larger screen.

         Download Mobile Apps

       Infrared Transceiver

         Infrared Transmitter

          The infrared transmitter can transmit signals to control electronics such as TVs, air conditioners (AC), stereo systems, and others.  Flipper Zero has a built-in library of signals for common TVs, ACs, projectors, and stereo systems brands. This library is regularly updated with new signals, thanks to the Flipper Zero community's active contributions to the IR Remote database.

         Infrared learning feature
          Flipper Zero also has an IR receiver that can receive signals and save them to the library, so you can store any of your existing remotes to transmit commands later, and add them to the public IR Remote database to share with other Flipper Zero users.

       MicroSD card

         External storage for apps and data

          There is a variety of data Flipper Zero has to store: remote codes, signal databases, dictionaries, image assets, logs, and more. All this data is stored on a MicroSD card.  The MicroSD card slot has a push-push type connector, so the card is reliably secured inside without sticking out. Flipper Zero supports any FAT12, FAT16, FAT32 and exFAT formatted MicroSD cards to store your assets so you'll never have to worry the memory will run out.

       Tool for Hardware Exploration

          Flipper Zero is a versatile tool for hardware exploration, firmware flashing, debugging, and fuzzing. It can be connected to any piece of hardware using GPIO to control it with buttons, run your own code and print debug messages to the LCD. It can also be used as a regular USB adapter for UART, SPI, I2C, etc.

           Completely Autonomous  Flipper Zero features built-in 5V and 3.3V power pins. Control the device with built-in buttons and display — no PC is needed.
           SPI, UART, I2C to USB converter  Communicate with any hardware from your desktop application.
           Flashing and debugging tools    SPI Flash Programmer  AVR ISP Programmer  OpenDAP
           Fuzzing tool  Test any protocols and signals.

       iButton

         1-Wire keys (Touch Memory)

          Flipper Zero has a built-in 1-Wire connector to read iButton contact keys. This old technology is still widely used around the world. It uses the 1-Wire protocol that doesn't have any authentication. Flipper can easily read these keys, store IDs in the memory, write IDs to blank keys and emulate the key itself.  Flipper Zero has a unique iButton contact pad design — its shape works both as a reader and a probe to connect to iButton sockets.

       What's Inside

       Tech specs

      MCU (Microcontroller unit)

       Model:  STM32WB55RG   Application processor: ARM Cortex-M4 32-bit 64 MHz  Radio processor: ARM Cortex-M0+ 32-bit 32 MHz  Radio: Bluetooth LE 5.4, 802.15.4 and proprietary  Flash: 1024 KB (shared between application and radio)  SRAM: 256 KB (shared between application and radio)

      Display

       LCD Monochrome Resolution: 128x64 px Controller: ST7567 Interface: SPI Diagonal Size: 1.4“

      Battery

       LiPo 2100 mAh Up to 28 days battery life

      Sub-1 GHz module

       Transceiver:  CC1101   TX Power: -20 dBm max   Frequency bands (depends on your region):    315 MHz  433 MHz  868 MHz  915 MHz

      Infrared

       RX wavelength: 950 nm (+/-100nm) RX carrier: 38 KHz (+/-5%) TX wavelength: 940 nm TX carrier: 0-2 MHz TX power: 300 mW  Supported protocols:    NEC family  Kaseikyo  RCA  RC5, RC6  Samsung  SIRC

      iButton 1-Wire

       Read 1-Wire keys Save to SD card Write (only rewritable keys) Emulate 1-Wire keys Supported protocols:   Dallas DS199x, DS1971  CYFRAL  Metakom  TM2004  RW1990

      RFID

       Frequency: 125 kHz Modulation: AM/OOK Coding: ASK, PSK Supported cards:   EM400x, EM410x, EM420x  HID  Indala  FDX (A & B)  Pyramid  AWID  Viking  Jablotron  Paradox  PAC Stanley  Keri  Gallagher  NexWatch

      NFC

       Read NFC cards Save to SD card Write (only rewritable cards) Emulate:   NXP MIFARE Classic®, Ultralight®, DESFire®, etc.  FeliCa™  HID iClass (PicoPass™)  NFC Forum protocols

      USB

       Type-C, USB 2.0 (12 Mbps) USB device Charging (1A max)

      GPIO

       13 I/O pins available to user on external 2.54 mm connectors 3.3V CMOS Level Input 5V tolerant (See  AN4899 ) Up to 20 mA per digital pin

      Bluetooth LE 5.4

       TX power: 4 dBm max RX sensitivity: -96 dBm Data rate: 2 Mbps

      Vibration Motor

       Force value: 30 N Speed: 13500 rpm

      MicroSD

       Up to 256 GB microSD card (SPI mode) 2-32 GB card recommended Read/Write speed: up to 5 Mbps Supported file systems: FAT12, FAT16, FAT32, and exFAT

      Buzzer

       Frequency: 100-2500 Hz Sound Output: 87 dB Type: Coin

      Control

       5-button directional pad Back button

      Body

       Size: 100x40x25 mm (3.95x1.58x1.01 inches) Weight: 102 grams (3.6 ounces) Materials: PC, ABS, PMMA Operating temperature: 0° to 40° C (32° to 104° F)

       GPIO Pinout

             Full-size Image

       Live 3D Model