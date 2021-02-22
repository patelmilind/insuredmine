
var end = 50;
var i = 1;

function print()
{
    if(i<=end)
    {
        console.log(i);
        i++;
        print();
    }
    else{
        return
    }
}

print();

