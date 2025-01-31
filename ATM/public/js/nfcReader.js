document.getElementById('startScan').addEventListener('click', async () => {
    const output = document.getElementById('output');
    output.textContent = 'Starting NFC detection...';
  
    // Check if the Web NFC API is supported
    if ('NDEFReader' in window) {
      try {
        const ndef = new NDEFReader();
        await ndef.scan();
        output.textContent = 'NFC detection started. Bring an NFC tag close.';
  
        ndef.onreading = () => {
          // This event triggers whenever an NFC tag is detected
          output.textContent = 'NFC tag detected!';
          window.location.href = "home"
        };
        ndef.onreadingerror = () => {
          // This event triggers if the NFC tag reading fails
          output.textContent = 'NFC detection failed. Try again.';
        };
      } catch (error) {
        output.textContent = `Error: ${error.message}`;
      }
    } else {
      output.textContent = 'Web NFC is not supported on this device.';
    }
  });