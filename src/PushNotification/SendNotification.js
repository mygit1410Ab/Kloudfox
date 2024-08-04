

export const  SendNotification= async (notificationData) => {

  // console.error('pressed',notificationData.receiverData.deviceToken)
  // console.log('pressed', notificationData.receiverData.deviceToken);
  // console.log('pressed',notificationData?.msgData?.msgType)
  // console.error('pressed',notificationData?.msgData?.message)


  // let deviceToken= ''
  // if(notificationData.receiverData.deviceToken){
  //   deviceToken=notificationData.receiverData.deviceToken
  // }else{
  //   deviceToken=notificationData.receiverData.fromDevice
  // }

  let deviceToken= ''
  let bodyMess=''
  if(notificationData.receiverData.deviceToken){
    deviceToken=notificationData.receiverData.deviceToken
  }else{
    deviceToken=notificationData.receiverData.fromDevice
  }

  if(notificationData?.msgData?.msgType === 'text'){
    bodyMess=notificationData?.msgData?.message
  }else if(notificationData?.msgData?.msgType === 'attachment'){
    bodyMess=`Image is shared by ${notificationData.userData.fullName}.`
  }else if(notificationData?.msgData?.msgType === 'videoURL'){
    bodyMess=`Video is shared by ${notificationData.userData.fullName}.`
  }else if(notificationData?.msgData?.msgType === 'gif'){
    bodyMess=`GIF is shared by ${notificationData.userData.fullName}.`
  }



  try {
    // console.log('------------------------------->',deviceToken)
    const notification = {
      to: deviceToken,
      notification: {
        title: `${notificationData.userData.fullName} sent you a message.`,
        body:bodyMess,
      },
      data: {
        additionalData: 'Some data',
      },
    };

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=AAAAZj20VbU:APA91bFAJSCAT4AE8dtryhtjBDBsmrYSPOEqz9axJpQBhtrbZhdEM8iV44DVyygPPFzu11rBxh774lNRjsUzAPkp_n1NDEQn3O2qcD3c1mQTJBbjUHXwAP5etwWHd-v90-THDB3nueXs`, // Replace with your server key
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Notification sent:', responseData);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

