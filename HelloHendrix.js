console.log('Loading new version 3');

exports.handler = function(event, context) {
    console.log('Hello Hendrix! v3');
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('value1 =', event.key1);
    console.log('value2 =', event.key2);
    console.log('value3 =', event.key3);
    context.succeed(event.key1);  // Echo back the first key value
    // context.fail('Something went wrong');
};