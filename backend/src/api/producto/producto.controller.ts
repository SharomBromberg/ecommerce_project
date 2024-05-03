import { Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ProductoService } from './producto.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';

@Controller('')
export class ProductoController {

    constructor(
        private readonly _productoService: ProductoService
    ) {

    }

    @Post('createCategoria')
    // @UseGuards(AuthGuard)
    async createCategoria(@Res() res, @Req() req) {
        const data = req.body;
        const categoria = await this._productoService.createCategoria(data);
        res.status(200).send(categoria);
    }

    @Get('getCategorias/:clasificacion')
    // @UseGuards(AuthGuard)
    async getCategorias(@Res() res, @Req() req, @Param('clasificacion') clasificacion) {
        const categorias = await this._productoService.getCategorias(clasificacion);
        res.status(200).send(categorias);
    }
    @Put('setStateCategoria/:id')
    @UseGuards(AuthGuard)
    async setStateCategoria(@Res() res, @Req() req, @Param('id') id: any) {
        let data = req.body;
        const categorias = await this._productoService.setStateCategoria(id, data);
        res.status(200).send(categorias);
    }
    @Get('getCategoria/:id')
    @UseGuards(AuthGuard)
    async getCategoria(@Res() res, @Req() req, @Param('id') id: any) {
        const categoria = await this._productoService.getCategoria(id);
        res.status(200).send(categoria);
    }
    @Put('updateCategoria/:id')
    @UseGuards(AuthGuard)
    async updateCategoria(@Res() res, @Req() req, @Param('id') id: any) {
        let data = req.body;
        const categorias = await this._productoService.updateCategoria(id, data);
        res.status(200).send(categorias);
    }

    @Post('createProducto')
    @UseInterceptors(FilesInterceptor('files[]', 10, {
        storage: diskStorage({
            destination: './uploads/productos',
            filename: (req, file, cb) => {
                cb(null, uuidv4() + '' + extname(file.originalname));
            }
        }),
        limits: {
            fileSize: 2 * 1024 * 1024
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        }
    }))
    @UseGuards(AuthGuard)
    async createProducto(@Res() res, @Req() req, @UploadedFiles() files) {
        const data = req.body;
        let producto = await this._productoService.createProducto(data, files);
        res.status(200).send(producto);
    }


    @Get('getProductos/:filtro')
    @UseGuards(AuthGuard)
    async getProductos(@Res() res, @Req() req, @Param('filtro') filtro) {
        const productos = await this._productoService.getProductos(filtro);
        res.status(200).send(productos);
    }

    @Get('getProductoPortada/:img')
    async getProductoPortada(@Res() res, @Param('img') img) {
        const filename = './uploads/productos/' + img;

        if (fs.existsSync(filename)) {
            //SI
            res.status(200).sendFile(path.resolve(filename));
        } else {
            //NO
            res.status(200).sendFile(path.resolve('./uploads/default.jpg'));
        }
    }
    @Put('setStateProducto/:id')
    @UseGuards(AuthGuard)
    async setStateProducto(@Res() res, @Req() req, @Param('id') id: any) {
        let data = req.body;
        const productos = await this._productoService.setStateProducto(id, data);
        res.status(200).send(productos);
    }

    @Get('getProducto/:id')
    @UseGuards(AuthGuard)
    async getProducto(@Res() res, @Req() req, @Param('id') id: any) {
        const producto = await this._productoService.getProducto(id);
        res.status(200).send(producto);
    }

    @Get('getVariacionesProducto/:id')
    @UseGuards(AuthGuard)
    async getVariacionesProducto(@Res() res, @Req() req, @Param('id') id: any) {
        const variaciones = await this._productoService.getVariacionesProducto(id);
        res.status(200).send(variaciones);
    }

    @Get('getGaleriaProducto/:id')
    @UseGuards(AuthGuard)
    async getGaleriaProducto(@Res() res, @Req() req, @Param('id') id: any) {
        const galeria = await this._productoService.getGaleriaProducto(id);
        res.status(200).send(galeria);
    }

    @Put('updateProducto/:id') //aquí el metodo será put porque vamos a enviar un parametro
    // y también vamos a enviar datos por el cuerpo de la solicitud
    @UseGuards(AuthGuard)
    async updateProducto(@Res() res, @Req() req, @Param('id') id: any) {
        let data = req.body;
        const producto = await this._productoService.updateProducto(id, data);
        res.status(200).send(producto);
    }

    @Post('addVariacion')
    @UseGuards(AuthGuard)
    async addVariacion(@Res() res, @Req() req) {
        const data = req.body;
        const variacion = await this._productoService.addVariacion(data);
        res.status(200).send(variacion);
    }
    @Delete('deleteVariacion/:id')
    @UseGuards(AuthGuard)
    async deleteVariacion(@Res() res, @Req() req, @Param('id') id: any) {
        const variacion = await this._productoService.deleteVariacion(id);
        res.status(200).send(variacion);
    }

    @Delete('deleteImgProducto/:id')
    @UseGuards(AuthGuard)
    async deleteImgProducto(@Res() res, @Req() req, @Param('id') id: any) {
        const imagen = await this._productoService.deleteImgProducto(id);
        res.status(200).send(imagen);
    }
}

