using LinearAlgebra.BLAS
using LinearAlgebra

"""
    algorithm0(ml0::Array{Float64,1}, ml1::Array{Float64,1}, ml2::Array{Float64,1})

Compute
alpha = (x^T z x^T y).

# Arguments
- `ml0::Array{Float64,1}`: Operand x of size 10.
- `ml1::Array{Float64,1}`: Operand z of size 10.
- `ml2::Array{Float64,1}`: Operand y of size 10.
"""                    
function algorithm0(ml0::Array{Float64,1}, ml1::Array{Float64,1}, ml2::Array{Float64,1})
    # cost: 41 FLOPs
    # x: ml0, full, z: ml1, full, y: ml2, full
    ml3 = Array{Float64}(undef, 1, 1)
    # tmp3 = (x^T y)
    ml3 = BLAS.dot(10, ml0, 1, ml2, 1)

    # x: ml0, full, z: ml1, full, tmp3: ml3, full
    ml4 = Array{Float64}(undef, 1, 1)
    # tmp1 = (x^T z)
    ml4 = BLAS.dot(10, ml0, 1, ml1, 1)

    # tmp3: ml3, full, tmp1: ml4, full
    ml5 = Array{Float64}(undef, 1, 1)
    # tmp8 = (tmp3 tmp1)
    ml5 = ml3 * ml4

    # tmp8: ml5, full
    # alpha = tmp8
    return (ml5)
end