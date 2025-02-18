async function traerIpPublica() {
    try {
        const publicIpResponse = await fetch('https://api.ipify.org?format=json');
        const publicIpData = await publicIpResponse.json();
        document.getElementById('public-ip').innerText = publicIpData.ip;

    } catch (error) {
        document.getElementById('public-ip').innerText = "Error al obtener IP pública.";
    }
}

window.onload = () => {
    traerIpPublica();
};

function esteroaIp(num) {
    return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
    ].join('.');
}

function calcularMascara(prefix) {
    const mask = (0xFFFFFFFF >>> (32 - prefix)) << (32 - prefix);
    return [
        (mask >>> 24) & 255,
        (mask >>> 16) & 255,
        (mask >>> 8) & 255,
        mask & 255
    ].join('.');
}

function ipaEntero(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function calcularSubnets() {
    const networkInput = document.getElementById('network').value;
    const subnetCountInput = document.getElementById('subnets');
    const subnetCount = parseInt(subnetCountInput.value);
    const resultBody = document.getElementById('resultados');
    resultBody.innerHTML = "";

    if (!networkInput || !subnetCount) {
        resultBody.innerHTML = "<tr><td colspan='4' class='text-danger'>Por favor ingresa una dirección de red válida y el número de subredes.</td></tr>";
        return;
    }

    const [networkAddress, prefix] = networkInput.split('/');
    const prefixInt = parseInt(prefix);

    const newPrefix = prefixInt + Math.ceil(Math.log2(subnetCount));
    const subnetSize = Math.pow(2, 32 - newPrefix);

    const subnetMask = calcularMascara(newPrefix);

    let currentNetwork = ipaEntero(networkAddress);
    for (let i = 0; i < subnetCount; i++) {
        const network = esteroaIp(currentNetwork);
        const broadcast = esteroaIp(currentNetwork + subnetSize - 1);
        resultBody.innerHTML += `<tr>
            <td>Subred ${i + 1}</td>
            <td>${network}/${newPrefix}</td>
            <td>${broadcast}</td>
            <td>${subnetMask}</td>
        </tr>`;
        currentNetwork += subnetSize;
    }
    
    subnetCountInput.value = subnetCount;
}

function desplegarSubnets() {
    const networkInput = document.getElementById('network').value;
    const subnetCountInput = document.getElementById('subnets');
    const subnetError = document.getElementById('subnet-error');
    const prefixMatch = networkInput.match(/\/(\d+)$/);

    if (prefixMatch) {
        const prefix = parseInt(prefixMatch[1]);
        const maxSubnets = Math.pow(2, 32 - prefix);
        subnetCountInput.innerHTML = `<option value="">Seleccione una opción</option>`;
        
        for (let i = 1; i <= maxSubnets / 2; i *= 2) {
            subnetCountInput.innerHTML += `<option value="${i}">${i}</option>`;
        }
        subnetError.innerText = "";
    } else {
        subnetCountInput.innerHTML = `<option value="">Seleccione una opción</option>`;
        subnetError.innerText = "Por favor ingresa una dirección de red válida con prefijo.";
    }
}

function validarBits(event) {
    const input = event.target;
    const bits = input.value.replace(/[^01]/g, '');
    input.value = bits;
    document.getElementById('bit-counter').innerText = `Bits ingresados: ${bits.length}`;
}

function convertirBinario() {
    const binaryInput = document.getElementById('binary-input').value;
    const decimal = parseInt(binaryInput, 2);
    const hexadecimal = decimal.toString(16).toUpperCase();

    const conversionBody = document.getElementById('binario-a-decimal');
    conversionBody.innerHTML = `<tr>
        <td>${decimal}</td>
        <td>${hexadecimal}</td>
    </tr>`;
}

function convertirDecimal() {
    const decimalInput = document.getElementById('decimal-input').value;
    const binary = parseInt(decimalInput).toString(2);
    const hexadecimal = parseInt(decimalInput).toString(16).toUpperCase();

    const decimalConversionBody = document.getElementById('decimal-a-binario');
    decimalConversionBody.innerHTML = `<tr>
        <td>${binary}</td>
        <td>${hexadecimal}</td>
    </tr>`;
}

function modoOscuro() {
    document.body.classList.toggle('dark-mode');
}