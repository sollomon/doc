var len  = function(obj){
    var len=0;
    for(var i in obj){
        len++
    }
    return len;
}

var pearson_correlation = function(dataset,p1,p2){
    var existp1p2 = {};
    for(item in dataset[p1]){
                if(item in dataset[p2]){
                    existp1p2[item] = 1
                }
            }
            var num_existence = len(existp1p2);
    if(num_existence ==0) return 0;
    //store the sum and the square sum of both p1 and p2
            //store the product of both
            var p1_sum=0,
                p2_sum=0,
                p1_sq_sum=0,
                p2_sq_sum=0,
                prod_p1p2 = 0;
            //calculate the sum and square sum of each data point
            //and also the product of both point
            for(var item in existp1p2){
                p1_sum += dataset[p1][item];
                p2_sum += dataset[p2][item];
    p1_sq_sum += Math.pow(dataset[p1][item],2);
                p2_sq_sum += Math.pow(dataset[p2][item],2);
    prod_p1p2 += dataset[p1][item]*dataset[p2][item];
            }
            var numerator =prod_p1p2 - (p1_sum*p2_sum/num_existence);
    var st1 = p1_sq_sum - Math.pow(p1_sum,2)/num_existence;
            var st2 = p2_sq_sum -Math.pow(p2_sum,2)/num_existence;
    var denominator = Math.sqrt(st1*st2);
    if(denominator ==0) return 0;
            else {
                var value = numerator / denominator;
                return value;
            }
            
    }

    var similar_user = function(dataset,person,num_user,distance){
        var scores=[];
        for(var others in dataset){
                if(others != person && typeof(dataset[others])!="function"){
                    var value = distance(dataset,person,others)
                    var p = others
                    scores.push({value:value,p:p});
                }
            }
            scores.sort(function(a,b){
                return b.value < a.value ? -1 : b.value > a.value ? 1 : b.value >= a.value ? 0 : NaN;
            });
            var score=[];
            for(var i =0;i<num_user;i++){
                score.push(scores[i]);
            }
        return score;
    }

    //similar_user(dataset,'Jack Matthews',3,pearson_correlation);

    module.exports = {
        pearson:pearson_correlation,
        similar:similar_user
    }