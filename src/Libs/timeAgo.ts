export default  function __timeAgo(value:any) {

    if (value > Date.now()) {
        //last
        return last(value)
    }
    else {
        //ago
        return ago(value);
    }


}

function ago(value:any) {

    const seconds = Math.floor((value - Math.floor(Date.now()/1000)));
    if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
            return 'لحظاتی بعد';
    const intervals: { [key: string]: number } = {
        'روز': 86400,
        'ساعت': 3600,
        'دقیقه': 60,
        'ثانیه': 1
    };
    let counter;
  for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0)
          if (counter === 1) {
              return counter + ' ' + i + ' بعد'; // singular (1 day ago)
          } else {
              return counter + ' ' + i + ' بعد'; // plural (2 days ago)
          }
  }

  return value

}

function last(value:any){

    if (value) {
        const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
        if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
            return 'لحظاتی پیش';
            const intervals: { [key: string]: number } = {
              'سال': 31536000,
              'ماه': 2592000,
              'هفته': 604800,
              'روز': 86400,
              'ساعت': 3600,
              'دقیقه': 60,
              'ثانیه': 1
          };
          let counter;
        for (const i in intervals) {
            counter = Math.floor(seconds / intervals[i]);
            if (counter > 0)
                if (counter === 1) {
                    return counter + ' ' + i + ' قبل'; // singular (1 day ago)
                } else {
                    return counter + ' ' + i + ' قبل'; // plural (2 days ago)
                }
        }
    }
    return value;
}