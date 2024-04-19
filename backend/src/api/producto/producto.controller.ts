import { Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ProductoService } from './producto.service';

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

}
