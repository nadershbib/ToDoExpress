


exports.today=function(){
    let day = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    return day.toLocaleDateString("eng-US", options);
}