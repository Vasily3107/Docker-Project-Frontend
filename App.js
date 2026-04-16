import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const globals = {
    user: undefined,
    list: undefined
};

const utils = {
    fileToDataURL: async (fileHandle) => {
        const file = await fileHandle.getFile();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    main_text: {
        fontSize: 48
    },
    centeredList: {
        flexGrow: 1,
        alignItems: 'center',
    },
});

const ImageTextButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={{
            height: props.btn_h, width: props.btn_w, backgroundColor: props.bg_color,
            alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderRadius: 10, gap: 10
        }}>
            <Image source={props.img_url} style={{ height: props.img_res || 30, width: props.img_res || 30 }} />
            <Text style={{ fontSize: props.fontSize || 24, fontWeight: 'bold', color: props.txt_color || '#000' }}>{props.text}</Text>
        </TouchableOpacity>
    );
};

const ImageButton = (props) => {
    const img_res = props.img_res || 30;
    return (
        <TouchableOpacity
            style={{ backgroundColor: props.color, borderRadius: 10, flex: 1, height: 30, alignItems: 'center', justifyContent: 'center' }}
            onPress={props.onPress}
        >
            <Image source={props.img_url} style={{ height: img_res, width: img_res }} />
        </TouchableOpacity>
    );
};

const Button = (props) => {
    return (
        <TouchableOpacity
            style={{ backgroundColor: props.color, borderRadius: 10, width: props.width || 100, height: props.height || 30, alignItems: 'center', justifyContent: 'center', borderWidth: props.borderWidth || 0 }}
            onPress={props.onPress}
        >
            <Text style={{ fontSize: props.fontSize || 24, fontWeight: 'bold', color: props.txt_color || '#000' }}>{props.text}</Text>
        </TouchableOpacity>
    );
};

const req = async (route, body) => {
    const res = await axios.post('http://localhost:3000/' + route, body);
    return res.data;
}

const log_out = (nav) => {
    globals.user = undefined;
    nav.navigate('start');
}

const screen_log_in = ({ navigation }) => {
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [text, setText] = useState('');

    const log_in = async () => {
        if (!name || !pass)
            return setText('Fields cannot be empty')

        const res = await req('log_in', { name: name, password: pass });

        if (res.status == 400)
            return setText(res.message);

        globals.user = res.data;
        globals.user.password = pass;
        navigation.navigate('home');
    }

    return (
        <View style={styles.container}>

            <View style={{ width: 500, height: '95%', borderRadius: 10, borderWidth: 3, alignItems: 'center' }}>
                <View style={{ height: '15%' }}></View>
                <Button text='Return' height={50} borderWidth={3} width='70%' onPress={() => navigation.navigate('start')} />
                <View style={{ height: '6%' }}></View>
                <TextInput
                    style={{ borderRadius: 10, borderWidth: 3, width: '70%', height: 50, fontSize: 24, fontWeight: 'light', paddingLeft: 30, borderStyle: 'dashed' }}
                    placeholder='Name:'
                    value={name}
                    onChangeText={setName}
                />
                <View style={{ height: '1%' }}></View>
                <TextInput
                    style={{ borderRadius: 10, borderWidth: 3, width: '70%', height: 50, fontSize: 24, fontWeight: 'light', paddingLeft: 30, borderStyle: 'dashed' }}
                    placeholder='Password:'
                    value={pass}
                    onChangeText={setPass}
                />
                <View style={{ height: '1%' }}></View>
                <Button text='Log in' height={50} borderWidth={3} width='70%' onPress={log_in} />
                <View style={{ height: '3%' }}></View>
                <Text style={{ color: '#c33', fontSize: 24 }}>{text}</Text>
            </View>

        </View>
    );
}

const screen_sign_up = ({ navigation }) => {
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [pas2, setPas2] = useState('');
    const [text, setText] = useState('');

    const sign_up = async (role) => {
        if (!name || !pass || !pas2)
            return setText('Fields cannot be empty')
        if (pass != pas2)
            return setText('Passwords do not match')

        const res = await req('sign_up', { name: name, password: pass, role: role });

        if (res.status == 400)
            return setText(res.message);

        globals.user = res.data;
        globals.user.password = pass;
        navigation.navigate('home');
    }

    return (
        <View style={styles.container}>

            <View style={{ width: 500, height: '95%', borderRadius: 10, borderWidth: 3, alignItems: 'center' }}>
                <View style={{ height: '15%' }}></View>
                <Button text='Return' height={50} borderWidth={3} width='70%' onPress={() => navigation.navigate('start')} />
                <View style={{ height: '6%' }}></View>
                <TextInput
                    style={{ borderRadius: 10, borderWidth: 3, width: '70%', height: 50, fontSize: 24, fontWeight: 'light', paddingLeft: 30, borderStyle: 'dashed' }}
                    placeholder='Name:'
                    value={name}
                    onChangeText={setName}
                />
                <View style={{ height: '1%' }}></View>
                <TextInput
                    style={{ borderRadius: 10, borderWidth: 3, width: '70%', height: 50, fontSize: 24, fontWeight: 'light', paddingLeft: 30, borderStyle: 'dashed' }}
                    placeholder='Password:'
                    value={pass}
                    onChangeText={setPass}
                />
                <View style={{ height: '1%' }}></View>
                <TextInput
                    style={{ borderRadius: 10, borderWidth: 3, width: '70%', height: 50, fontSize: 24, fontWeight: 'light', paddingLeft: 30, borderStyle: 'dashed' }}
                    placeholder='Confirm password:'
                    value={pas2}
                    onChangeText={setPas2}
                />
                <View style={{ height: '1%' }}></View>
                <Button text='Sign up as user' height={50} borderWidth={3} width='70%' onPress={() => { sign_up('user') }} />
                <View style={{ height: '1%' }}></View>
                <Button text='Sign up as admin' height={50} borderWidth={3} width='70%' onPress={() => { sign_up('admin') }} />
                <View style={{ height: '3%' }}></View>
                <Text style={{ color: '#c33', fontSize: 24 }}>{text}</Text>
            </View>

        </View>
    );
}

const screen_admin = ({ navigation }) => {
    useEffect(() => {
        if (globals.user == undefined) return navigation.navigate('start');
        if (globals.user.role == 'user') return navigation.navigate('start');
    });

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [img, setImg] = useState('');
    const [text, setText] = useState('');
    const [list, setList] = useState([]);

    const load_products = async () => {
        const prods = (await req('products', {})).data;
        setList(prods);
    }

    useEffect(() => {
        if (globals.list != undefined)
            return setList(globals.list);
        (async () => {
            const prods = (await req('products', {})).data;
            setList(prods);
        })();
    }, []);

    const add_product = async () => {
        if (!title || !price)
            return setText('Fields cannot be empty');
        if (!img)
            return setText('Select image');
        if (isNaN(Number(price)) || Number(price) <= 0)
            return setText('Invalid price value');

        const res = await req('admin/add_product', {
            name: globals.user.name,
            password: globals.user.password,
            title: title,
            price: Number(price),
            img: img
        });

        if (res.status == 400)
            return setText(res.message);
        setText('')
        load_products();
    };

    const delete_product = async (id) => {
        const res = await req('admin/delete_product', {
            name: globals.user.name,
            password: globals.user.password,
            id: id
        });
        load_products();
    };

    const image_picker = async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Images',
                    accept: { 'image/*': ['.png', '.jpeg', '.jpg'] }
                }],
            });
            const file = await fileHandle.getFile();

            if (!file.name.endsWith('.png') && !file.name.endsWith('.jpeg') && !file.name.endsWith('.jpg'))
                return setText('File extension must be .png or .jpg');
            if (file.size / 1024 / 1024 > 5)
                return setText('Image must be less than 5 MB in size');

            const img_str = await utils.fileToDataURL(fileHandle);
            setImg(img_str);
        } catch (err) {
            console.log(err);
        }
    };

    const render_product = ({ item }) => {
        return (
            <View style={{ alignItems: 'center', height: 300, width: 200, borderWidth: 3, borderRadius: 10, marginHorizontal: 3, paddingTop: 10 }}>
                <Image source={{ uri: item.img }} style={{ width: '80%', aspectRatio: 1, borderRadius: 10 }} />
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>${item.price}</Text>
                <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 3 }}>
                    <Button text='Delete' height={30} borderWidth={3} width='70%' onPress={() => { delete_product(item._id) }} />
                </View>
            </View>
        )
    }

    return (
        <View style={{ ...styles.container, justifyContent: 'flex-start' }}>

            <View style={{ flexDirection: 'row', marginTop: 50, borderWidth: 3, borderRadius: 10, width: '95%', height: 50, alignItems: 'center', gap: 20, paddingHorizontal: 50 }} >
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile:</Text>
                <Text style={{ fontSize: 24, fontWeight: 'light' }}>Name: "{globals.user.name}"</Text>
                <Text style={{ fontSize: 24, fontWeight: 'light' }}>Role: "{globals.user.role}"</Text>

                <View style={{ width: 3, borderRadius: 10, backgroundColor: '#000', height: '90%', marginHorizontal: 30 }}></View>

                <Button text='Refresh list' height='90%' borderWidth={3} width={200} onPress={() => { load_products() }} />
                <View style={{ flex: 1, alignSelf: 'stretch' }}></View>
                <Button text='Log out' height='90%' borderWidth={3} width={100} onPress={() => { log_out(navigation) }} />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', width: '95%', gap: 10 }}>
                <View style={{ marginTop: 10, borderWidth: 3, borderRadius: 10, width: '70%', height: '95%', alignItems: 'center', gap: 20 }} >
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Products:</Text>
                    <FlatList
                        style={{ flex: 1, alignSelf: 'stretch', justifyItems: 'center' }}
                        contentContainerStyle={styles.centeredList}
                        data={list}
                        keyExtractor={(item) => uuidv4()}
                        numColumns={4}
                        renderItem={render_product}
                    />
                </View>
                <View style={{ marginTop: 10, borderWidth: 3, borderRadius: 10, flex: 1, height: '95%', alignItems: 'center', gap: 10 }} >
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Add product:</Text>
                    <TextInput
                        style={{ borderRadius: 10, borderWidth: 3, width: '95%', height: 50, fontSize: 24, fontWeight: 'light', paddingLeft: 30, borderStyle: 'dashed' }}
                        placeholder='Title:'
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={{ borderRadius: 10, borderWidth: 3, width: '95%', height: 50, fontSize: 24, fontWeight: 'light', paddingLeft: 30, borderStyle: 'dashed' }}
                        placeholder='Price:'
                        value={price}
                        onChangeText={setPrice}
                    />
                    <Button text='Select image' height={50} borderWidth={3} width='70%' onPress={() => { image_picker() }} />
                    <Button text='Add product' height={50} borderWidth={3} width='70%' onPress={() => { add_product() }} />
                    <Text style={{ fontSize: 24, fontWeight: 'light', color: '#c33' }}>{text}</Text>
                    <Image source={{ uri: img }} style={{ width: '70%', aspectRatio: 1, borderRadius: 10 }} />
                </View>
            </View>

        </View>
    );
}

const screen_home = ({ navigation }) => {
    useEffect(() => {
        if (globals.user == undefined) return navigation.navigate('start');
        if (globals.user.role == 'admin') return navigation.navigate('admin');
    });

    const [list, setList] = useState([]);
    const [orders, setOrders] = useState([]);

    const load_products = async () => {
        const prods = (await req('products', {})).data;
        setList(prods);
    }

    const load_orders = async () => {
        const orders = (await req('orders', { user_id: globals.user._id })).data.reverse();
        setOrders(orders);
    }

    useEffect(() => {
        (async () => {
            await load_orders();
            await load_products();
        })();
    }, []);

    const add_order = async (item_id) => {
        const res = await req('add_order', {
            user_id: globals.user._id,
            product_id: item_id
        });
        await load_orders();
        await load_products();
    }

    const render_product = ({ item }) => {
        let ordered = orders.find(i => i.order._id == item._id);
        if (ordered && ordered.status != 'pending') ordered = false;
        return (
            <View style={{ alignItems: 'center', height: 300, width: 200, borderWidth: 3, borderRadius: 10, marginHorizontal: 3, position: 'relative' }}>
                <Image source={{ uri: item.img }} style={{ width: '80%', aspectRatio: 1, borderRadius: 10, marginTop: 10 }} />
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>${item.price}</Text>
                <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 3 }}>
                    <Button text='Order' height={30} borderWidth={3} width='95%' onPress={() => { if (!ordered) add_order(item._id) }} />
                </View>
                {ordered && (
                    <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', position: 'absolute', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>Ordered</Text>
                    </View>
                )}
            </View>
        )
    }

    const buy = async (id) => {
        const res = await req('update_order', {
            id: id,
            update: {
                status: 'paid'
            }
        })
        await load_orders();
        await load_products();
    }
    const cancel = async (id) => {
        const res = await req('update_order', {
            id: id,
            update: {
                status: 'cancelled'
            }
        })
        await load_orders();
        await load_products();
    }

    const render_order = ({ item }) => {
        const order = item.order;
        if (item.status == 'pending')
            return (
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', width: '80%', borderWidth: 3, borderRadius: 10, marginVertical: 3, paddingTop: 10 }}>
                        <Image source={{ uri: order.img }} style={{ width: '30%', aspectRatio: 1, borderRadius: 10 }} />
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{order.title}</Text>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>${order.price}</Text>
                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', gap: 15, marginVertical: 5, flexDirection: 'row' }}>
                            <Button text='Buy' height={30} borderWidth={3} width='40%' onPress={() => { buy(item._id) }} />
                            <Button text='Cancel' height={30} borderWidth={3} width='40%' onPress={() => { cancel(item._id) }} />
                        </View>
                    </View>
                </View>
            )
        return (
            <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={{ alignItems: 'center', width: '80%', borderWidth: 3, borderRadius: 10, marginVertical: 3, paddingTop: 10 }}>
                    <Image source={{ uri: order.img }} style={{ width: '30%', aspectRatio: 1, borderRadius: 10 }} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{order.title}</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>${order.price}</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: item.status == 'paid' ? '#3c3' : '#c33' }}>{item.status.toUpperCase()}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{ ...styles.container, justifyContent: 'flex-start' }}>

            <View style={{ flexDirection: 'row', marginTop: 50, borderWidth: 3, borderRadius: 10, width: '95%', height: 50, alignItems: 'center', gap: 20, paddingHorizontal: 50 }} >
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile:</Text>
                <Text style={{ fontSize: 24, fontWeight: 'light' }}>Name: "{globals.user.name}"</Text>
                <Text style={{ fontSize: 24, fontWeight: 'light' }}>Role: "{globals.user.role}"</Text>

                <View style={{ width: 3, borderRadius: 10, backgroundColor: '#000', height: '90%', marginHorizontal: 30 }}></View>

                <Button text='Refresh list' height='90%' borderWidth={3} width={200} onPress={() => { load_products(); load_orders(); }} />
                <View style={{ flex: 1, alignSelf: 'stretch' }}></View>
                <Button text='Log out' height='90%' borderWidth={3} width={100} onPress={() => { log_out(navigation) }} />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', width: '95%', gap: 10 }}>
                <View style={{ marginTop: 10, borderWidth: 3, borderRadius: 10, width: '70%', height: '95%', alignItems: 'center', gap: 20 }} >
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Products:</Text>
                    <FlatList
                        style={{ flex: 1, alignSelf: 'stretch', justifyItems: 'center' }}
                        contentContainerStyle={styles.centeredList}
                        data={list}
                        keyExtractor={(item) => uuidv4()}
                        numColumns={4}
                        renderItem={render_product}
                    />
                </View>
                <View style={{ marginTop: 10, borderWidth: 3, borderRadius: 10, flex: 1, height: '95%', alignItems: 'center' }} >
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Orders:</Text>
                    <FlatList
                        style={{ flex: 1, alignSelf: 'stretch', justifyItems: 'center' }}
                        data={orders}
                        keyExtractor={(item) => uuidv4()}
                        renderItem={render_order}
                    />
                </View>
            </View>

        </View>
    );
}

const screen_start = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={{ width: 500, height: '95%', borderRadius: 10, borderWidth: 3, alignItems: 'center' }}>
                <View style={{ height: '15%' }}></View>
                <Button text='Log in' height={50} borderWidth={3} width='70%' onPress={() => navigation.navigate('log_in')} />
                <View style={{ height: '1%' }}></View>
                <Button text='Sign up' height={50} borderWidth={3} width='70%' onPress={() => navigation.navigate('sign_up')} />
            </View>
        </View>
    );
}


const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="start" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="start" component={screen_start} />
                <Stack.Screen name="log_in" component={screen_log_in} />
                <Stack.Screen name="sign_up" component={screen_sign_up} />
                <Stack.Screen name="home" component={screen_home} />
                <Stack.Screen name="admin" component={screen_admin} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

