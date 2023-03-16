module.exports.log = function(rating,time){
    return (Math.exp(2.027*rating))/time;
    //return Math.exp(20*rating/time);
}

