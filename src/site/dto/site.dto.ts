import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { OrderBy } from "../../common/enums";
import { CommonDTOs } from "../../common/dto";

export namespace SiteDtos {
  export class CreateSiteInput {
    @IsNotEmpty()
    @IsString()
    name: string;
  }
  export class UpdateSiteInput extends CreateSiteInput {}
  export class GetAllSiteInput {
    @IsOptional()
    @IsObject()
    pagination: CommonDTOs.PaginationInput;

    @IsOptional()
    @IsString()
    filterInputString: string;

    @IsOptional()
    @IsEnum(OrderBy)
    orderBy?: OrderBy;

    @IsOptional()
    @IsString()
    orderByColumn?: string;
  }
  export class GetStatsResponse {
    wirepasBuildingsCounts: number;
    sensorNodesCounts: number;
    assetsCounts: number;
    alertsCounts: number;
  }
}
