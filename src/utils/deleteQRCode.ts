async function deleteQRCode(
    url: string,
    {
      arg,
    }: {
      arg: {
        data: {
          code: any;
          guest: any;
        };
      };
    }
  ) {
    return fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg),
    }).then((res) => res.json());
  }
  
  export default deleteQRCode;
  


  // const deleteMatchingQRCodes = async (codeToDelete: number) => {
  //   try {
  //     const qrCodesData = await fetchQRCodes();
  //     const qrCodes = qrCodesData.data;

  //     const matchingQRCode = qrCodes?.filter(
  //       (qrCode: any) => qrCode.attributes.code === Number(barcodeId)
  //     );

  //     console.log("matchingQRCode", matchingQRCode);

  //     //   const codesToDelete = matchingQRCode[0].id;

  //     //   console.log("codesToDelete", codesToDelete);

  //     const matchingQRCodes = qrCodes.filter(
  //       (qrCode: any) => qrCode.attributes.code === codeToDelete
  //     );

  //     for (const qrCode of matchingQRCodes) {
  //       const qrCodeId = qrCode.id;
  //       const guestId = qrCode?.attributes.guest.data.id;

  //       // Update the guest's exit time before deleting the QR code
  //       await updateGuestExitTime(guestId);

  //       const deleteUrl = `https://proper-reward-aa454ad2f4.strapiapp.com/api/access-cards/${qrCodeId}`;
  //       await fetch(deleteUrl, {
  //         method: "DELETE",
  //       });

  //       console.log(
  //         `QR Code with ID ${qrCodeId} and code ${codeToDelete} deleted`
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error deleting QR Codes:", error);
  //     setMessage("Error deleting QR Code(s). Please try again.");
  //   }
  // };

  // const handleBarcodeSubmit = () => {
  //   deleteMatchingQRCodes(Number(barcodeId));
  // };
